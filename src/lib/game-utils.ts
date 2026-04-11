export type Winner = string;
export type ServingSide = 'left' | 'right';

export function calculateWinner(
	leftScore: number,
	rightScore: number,
	leftName: string,
	rightName: string,
	winningScore: number
): Winner | null {
	if (leftScore >= winningScore && leftScore - rightScore >= 2) {
		return leftName;
	}

	if (rightScore >= winningScore && rightScore - leftScore >= 2) {
		return rightName;
	}

	return null;
}

export function calculateServingSide(
	leftScore: number,
	rightScore: number,
	winningScore: number
): ServingSide {
	const totalPoints = leftScore + rightScore;
	const deuceThreshold = Math.max(0, (winningScore - 1) * 2);

	if (totalPoints < deuceThreshold) {
		return Math.floor(totalPoints / 2) % 2 === 0 ? 'left' : 'right';
	}

	return totalPoints % 2 === 0 ? 'left' : 'right';
}

export function formatHistoryDate(date: Date): string {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear().toString().slice(-2);

	return `${day}.${month}.${year}`;
}

export function formatHistoryTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	}).format(date);
}

export function isSameCalendarDay(left: Date, right: Date): boolean {
	return (
		left.getDate() === right.getDate() &&
		left.getMonth() === right.getMonth() &&
		left.getFullYear() === right.getFullYear()
	);
}
