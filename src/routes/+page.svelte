<script lang="ts">
	import HeadToHead from '$lib/components/HeadToHead.svelte';
	import HistoryList, { type GameHistoryEntry } from '$lib/components/HistoryList.svelte';
	import Tracker from '$lib/components/Tracker.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import WinnerDialog from '$lib/components/WinnerDialog.svelte';

	const player1 = 'Player 1' as const;
	const player2 = 'Player 2' as const;

	type Winner = typeof player1 | typeof player2;

	function getWinner(leftScore: number, rightScore: number): Winner | null {
		if (leftScore >= 11 && leftScore - rightScore >= 2) {
			return player1;
		}

		if (rightScore >= 11 && rightScore - leftScore >= 2) {
			return player2;
		}

		return null;
	}

	function formatHistoryDate(date: Date): string {
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

	let round = $state(0);
	let leftScore = $state(0);
	let rightScore = $state(0);
	let isWinnerDialogOpen = $state(false);
	let history = $state<GameHistoryEntry[]>([]);

	const winner = $derived(getWinner(leftScore, rightScore));

	$effect(() => {
		if (winner) {
			isWinnerDialogOpen = true;
			return;
		}

		isWinnerDialogOpen = false;
	});

	function updateLeftScore(value: number): void {
		const nextScore = Math.max(0, leftScore + value);
		const scoreChange = nextScore - leftScore;

		leftScore = nextScore;
		round += scoreChange;
	}

	function updateRightScore(value: number): void {
		const nextScore = Math.max(0, rightScore + value);
		const scoreChange = nextScore - rightScore;

		rightScore = nextScore;
		round += scoreChange;
	}

	function saveGameToHistory(): void {
		if (!winner) return;

		history = [
			{
				date: formatHistoryDate(new Date()),
				player1Score: leftScore,
				player2Score: rightScore,
				winnerName: winner
			},
			...history
		];
	}

	function startNewGame(): void {
		saveGameToHistory();
		leftScore = 0;
		rightScore = 0;
		round = 0;
		isWinnerDialogOpen = false;
	}
</script>

<WinnerDialog
	bind:open={isWinnerDialogOpen}
	{leftScore}
	{rightScore}
	{winner}
	onNewGame={startNewGame}
/>

<div class="flex min-h-screen flex-col items-center gap-6 px-6 py-8">
	<h1 class="text-6xl font-bold">TTT</h1>

	<section class="flex flex-row items-center gap-2">
		<h2 class="text-lg font-medium">Round</h2>
		<p class="text-lg font-medium">{round}</p>
	</section>

	<div class="grid w-full max-w-md grid-cols-2 gap-8">
		<Tracker
			title={player1}
			score={leftScore}
			decreaseLabel="Decrease tracker 1"
			increaseLabel="Increase tracker 1"
			onDecrease={() => updateLeftScore(-1)}
			onIncrease={() => updateLeftScore(1)}
		/>

		<Tracker
			title={player2}
			score={rightScore}
			decreaseLabel="Decrease tracker 2"
			increaseLabel="Increase tracker 2"
			onDecrease={() => updateRightScore(-1)}
			onIncrease={() => updateRightScore(1)}
		/>
	</div>

	{#if winner}
		<Button type="button" class="w-full max-w-md" onclick={startNewGame}>New game</Button>
	{/if}

	{#if history.length > 0}
		<HeadToHead entries={history} />
		<HistoryList entries={history} />
	{/if}
</div>
