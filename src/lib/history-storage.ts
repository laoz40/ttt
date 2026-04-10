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

		return Array.isArray(parsedNames) ? dedupePlayerNames(parsedNames.filter((name): name is string => typeof name === 'string')) : [];
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
