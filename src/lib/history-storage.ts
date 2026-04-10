export const historyStorageKeyPrefix = 'ttt-history:';

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

export function clearAllHistory(): void {
	if (typeof window === 'undefined') return;

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
