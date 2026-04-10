export type Winner = string;
export type ServingSide = 'left' | 'right';

export function calculateWinner(
	leftScore: number,
	rightScore: number,
	leftName: string,
	rightName: string
): Winner | null {
	if (leftScore >= 11 && leftScore - rightScore >= 2) {
		return leftName;
	}

	if (rightScore >= 11 && rightScore - leftScore >= 2) {
		return rightName;
	}

	return null;
}

export function calculateServingSide(leftScore: number, rightScore: number): ServingSide {
	const totalPoints = leftScore + rightScore;

	if (totalPoints < 20) {
		return Math.floor(totalPoints / 2) % 2 === 0 ? 'left' : 'right';
	}

	return totalPoints % 2 === 0 ? 'left' : 'right';
}

export function formatHistoryDate(date: Date): string {
	const now = new Date();
	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	if (isToday) {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		}).format(date);
	}

	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear().toString().slice(-2);

	return `${day}.${month}.${year}`;
}
