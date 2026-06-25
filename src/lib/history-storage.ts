export const historyStorageKeyPrefix = 'ttt-history:';
export const savedPlayerNamesStorageKey = 'ttt-saved-player-names';

export function normalizePlayerName(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
}

export function getHistoryStorageKey(leftName: string, rightName: string): string | null {
	const normalizedLeft = normalizePlayerName(leftName);
	const normalizedRight = normalizePlayerName(rightName);

	if (!normalizedLeft || !normalizedRight) {
		return null;
	}

	const [first, second] = [normalizedLeft.toLowerCase(), normalizedRight.toLowerCase()].sort();

	return `${historyStorageKeyPrefix}${first}|${second}`;
}

function dedupePlayerNames(names: string[]): string[] {
	const uniqueNames = new Map<string, string>();

	for (const name of names) {
		const normalizedName = normalizePlayerName(name);

		if (!normalizedName) continue;

		const lowerCaseName = normalizedName.toLowerCase();

		if (!uniqueNames.has(lowerCaseName)) {
			uniqueNames.set(lowerCaseName, normalizedName);
		}
	}

	return [...uniqueNames.values()].sort((left, right) => left.localeCompare(right));
}

export function getSavedPlayerNames(): string[] {
	if (typeof window === 'undefined') return [];

	const storedNames = localStorage.getItem(savedPlayerNamesStorageKey);

	if (!storedNames) return [];

	try {
		const parsedNames = JSON.parse(storedNames) as unknown;

		return Array.isArray(parsedNames)
			? dedupePlayerNames(parsedNames.filter((name): name is string => typeof name === 'string'))
			: [];
	} catch {
		return [];
	}
}

export function saveSavedPlayerNames(names: string[]): string[] {
	if (typeof window === 'undefined') return [];

	const mergedNames = dedupePlayerNames([...getSavedPlayerNames(), ...names]);

	localStorage.setItem(savedPlayerNamesStorageKey, JSON.stringify(mergedNames));

	return mergedNames;
}

export function clearAllHistory(): void {
	if (typeof window === 'undefined') return;

	const keysToRemove = [] as string[];

	for (let index = 0; index < localStorage.length; index += 1) {
		const key = localStorage.key(index);

		if (key?.startsWith(historyStorageKeyPrefix) || key === savedPlayerNamesStorageKey) {
			keysToRemove.push(key);
		}
	}

	for (const key of keysToRemove) {
		localStorage.removeItem(key);
	}
}

export type StoredScoreHistory = {
	key: string;
	entries: unknown;
};

export type ScoreHistoryExport = {
	exportedAt: string;
	history: StoredScoreHistory[];
};

export type ImportScoreHistoryResult = {
	success: boolean;
	message: string;
};

export function getAllScoreHistory(): StoredScoreHistory[] {
	if (typeof window === 'undefined') return [];

	const historyEntries = [] as StoredScoreHistory[];

	for (let index = 0; index < localStorage.length; index += 1) {
		const key = localStorage.key(index);

		if (!key?.startsWith(historyStorageKeyPrefix)) continue;

		const storedHistory = localStorage.getItem(key);

		if (!storedHistory) {
			historyEntries.push({ key, entries: [] });
			continue;
		}

		try {
			historyEntries.push({ key, entries: JSON.parse(storedHistory) });
		} catch {
			historyEntries.push({ key, entries: storedHistory });
		}
	}

	return historyEntries.sort((left, right) => left.key.localeCompare(right.key));
}

export function getScoreHistoryExport(): ScoreHistoryExport {
	return {
		exportedAt: new Date().toISOString(),
		history: getAllScoreHistory()
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidRoundWinner(value: unknown): boolean {
	return value === 'player1' || value === 'player2';
}

function isValidScoreHistoryEntry(value: unknown): boolean {
	if (!isRecord(value)) return false;

	const hasRequiredStrings =
		typeof value.id === 'string' &&
		typeof value.date === 'string' &&
		typeof value.time === 'string' &&
		typeof value.winnerName === 'string';

	if (!hasRequiredStrings) return false;

	if (typeof value.player1Score !== 'number' || typeof value.player2Score !== 'number')
		return false;
	if (!Number.isFinite(value.player1Score) || !Number.isFinite(value.player2Score)) return false;

	if (value.player1Name !== undefined && typeof value.player1Name !== 'string') return false;
	if (value.player2Name !== undefined && typeof value.player2Name !== 'string') return false;
	if (value.legacyPlayedAt !== undefined && typeof value.legacyPlayedAt !== 'string') return false;

	return (
		value.roundWinners === undefined ||
		(Array.isArray(value.roundWinners) && value.roundWinners.every(isValidRoundWinner))
	);
}

function validateScoreHistoryExport(value: unknown): value is ScoreHistoryExport {
	if (!isRecord(value)) return false;
	if (typeof value.exportedAt !== 'string' || !Array.isArray(value.history)) return false;

	return value.history.every((historyEntry) => {
		if (!isRecord(historyEntry)) return false;
		if (typeof historyEntry.key !== 'string') return false;
		if (!historyEntry.key.startsWith(historyStorageKeyPrefix)) return false;
		if (!Array.isArray(historyEntry.entries)) return false;

		return historyEntry.entries.every(isValidScoreHistoryEntry);
	});
}

function clearScoreHistory(): void {
	const keysToRemove = [] as string[];

	for (let index = 0; index < localStorage.length; index += 1) {
		const key = localStorage.key(index);

		if (key?.startsWith(historyStorageKeyPrefix)) {
			keysToRemove.push(key);
		}
	}

	for (const key of keysToRemove) {
		localStorage.removeItem(key);
	}
}

export function validateScoreHistoryImport(value: unknown): ImportScoreHistoryResult {
	if (!validateScoreHistoryExport(value)) {
		return {
			success: false,
			message: 'Invalid score history JSON. Import a valid TTT export file.'
		};
	}

	return { success: true, message: 'Score history JSON is valid.' };
}

export function importScoreHistoryExport(value: unknown): ImportScoreHistoryResult {
	if (typeof window === 'undefined') {
		return { success: false, message: 'Import is only available in the browser.' };
	}

	const validationResult = validateScoreHistoryImport(value);

	if (!validationResult.success) {
		return validationResult;
	}

	clearScoreHistory();

	const scoreHistoryExport = value as ScoreHistoryExport;

	for (const historyEntry of scoreHistoryExport.history) {
		localStorage.setItem(historyEntry.key, JSON.stringify(historyEntry.entries));
	}

	return { success: true, message: 'Score history imported.' };
}
