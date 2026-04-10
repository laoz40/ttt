<script lang="ts">
	import { browser } from '$app/environment';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import HeadToHead from '$lib/components/HeadToHead.svelte';
	import HistoryEntryDialog from '$lib/components/HistoryEntryDialog.svelte';
	import HistoryList, { type GameHistoryEntry } from '$lib/components/HistoryList.svelte';
	import RoundIndicator, { type RoundWinner } from '$lib/components/RoundIndicator.svelte';
	import Tracker from '$lib/components/Tracker.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import WinnerDialog from '$lib/components/WinnerDialog.svelte';
	import { calculateServingSide, calculateWinner, formatHistoryDate } from '$lib/game-utils.js';
	import {
		getHistoryStorageKey,
		getSavedPlayerNames,
		normalizePlayerName,
		saveSavedPlayerNames
	} from '$lib/history-storage.js';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const defaultPlayer1Name = 'Player 1';
	const defaultPlayer2Name = 'Player 2';

	let player1Name = $state(defaultPlayer1Name);
	let player2Name = $state(defaultPlayer2Name);
	let round = $state(0);
	let leftScore = $state(0);
	let rightScore = $state(0);
	let winningScoreInput = $state('11');
	let isWinnerDialogOpen = $state(false);
	let history = $state<GameHistoryEntry[]>([]);
	let roundWinners = $state<RoundWinner[]>([]);
	let selectedHistoryEntry = $state<GameHistoryEntry | null>(null);
	let isHistoryDialogOpen = $state(false);
	let loadedHistoryKey = $state<string | null>(null);
	let savedPlayerNames = $state<string[]>([]);

	const historyStorageKey = $derived(getHistoryStorageKey(player1Name, player2Name));
	const targetScore = $derived.by(() => {
		const parsed = Number.parseInt(winningScoreInput, 10);

		return Number.isFinite(parsed) && parsed >= 1 ? parsed : 11;
	});
	const winner = $derived(
		calculateWinner(leftScore, rightScore, player1Name, player2Name, targetScore)
	);
	const servingSide = $derived(calculateServingSide(leftScore, rightScore, targetScore));

	// normalize player 1 name
	$effect(() => {
		// fallback to default player name if empty name
		const normalized = normalizePlayerName(player1Name) || defaultPlayer1Name;

		if (normalized !== player1Name) {
			player1Name = normalized;
		}
	});

	// normalize player 2 name
	$effect(() => {
		// fallback to default player name if empty name
		const normalized = normalizePlayerName(player2Name) || defaultPlayer2Name;

		if (normalized !== player2Name) {
			player2Name = normalized;
		}
	});

	// load saved player names from local storage
	$effect(() => {
		if (!browser) return;

		savedPlayerNames = getSavedPlayerNames();
	});

	// show winner dialog if there is a winner
	$effect(() => {
		if (winner) {
			isWinnerDialogOpen = true;
			return;
		}

		isWinnerDialogOpen = false;
	});

	// load history from local storage
	$effect(() => {
		if (!browser) return;

		const key = historyStorageKey;

		if (!key) {
			history = [];
			loadedHistoryKey = null;
			return;
		}

		const storedHistory = localStorage.getItem(key);

		if (!storedHistory) {
			history = [];
			loadedHistoryKey = key;
			return;
		}

		try {
			const parsedHistory = JSON.parse(storedHistory) as unknown;
			history = Array.isArray(parsedHistory)
				? (parsedHistory as GameHistoryEntry[]).map((entry) => ({
						...entry,
						player1Name: entry.player1Name ?? defaultPlayer1Name,
						player2Name: entry.player2Name ?? defaultPlayer2Name,
						roundWinners: entry.roundWinners ?? []
					}))
				: [];
		} catch {
			history = [];
		}

		loadedHistoryKey = key;
	});

	// save history to local storage
	$effect(() => {
		if (!browser || !historyStorageKey || historyStorageKey !== loadedHistoryKey) return;

		localStorage.setItem(historyStorageKey, JSON.stringify(history));
	});

	function addRoundWinner(winner: RoundWinner, count = 1): void {
		if (count <= 0) return;

		roundWinners = [...roundWinners, ...Array.from({ length: count }, () => winner)];
	}

	function removeRoundWinner(winner: RoundWinner, count = 1): void {
		if (count <= 0) return;

		const nextRoundWinners = [...roundWinners];
		let remaining = count;

		for (let index = nextRoundWinners.length - 1; index >= 0 && remaining > 0; index -= 1) {
			if (nextRoundWinners[index] === winner) {
				nextRoundWinners.splice(index, 1);
				remaining -= 1;
			}
		}

		roundWinners = nextRoundWinners;
	}

	function updateLeftScore(value: number): void {
		const nextScore = Math.max(0, leftScore + value);
		const scoreChange = nextScore - leftScore;

		leftScore = nextScore;
		round += scoreChange;

		if (scoreChange > 0) {
			addRoundWinner('player1', scoreChange);
		} else if (scoreChange < 0) {
			removeRoundWinner('player1', Math.abs(scoreChange));
		}
	}

	function updateRightScore(value: number): void {
		const nextScore = Math.max(0, rightScore + value);
		const scoreChange = nextScore - rightScore;

		rightScore = nextScore;
		round += scoreChange;

		if (scoreChange > 0) {
			addRoundWinner('player2', scoreChange);
		} else if (scoreChange < 0) {
			removeRoundWinner('player2', Math.abs(scoreChange));
		}
	}

	function sanitizeWinningScoreInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement | null;

		if (!input) return;

		const nextValue = input.value.replace(/\D+/g, '');

		winningScoreInput = nextValue;
		input.value = nextValue;
	}

	function saveGameToHistory(): void {
		if (!winner) return;

		savedPlayerNames = saveSavedPlayerNames([player1Name, player2Name]);
		history = [
			{
				date: formatHistoryDate(new Date()),
				player1Name,
				player1Score: leftScore,
				player2Name,
				player2Score: rightScore,
				roundWinners: [...roundWinners],
				winnerName: winner
			},
			...history
		];
	}

	function swapSides(): void {
		[player1Name, player2Name] = [player2Name, player1Name];
		[leftScore, rightScore] = [rightScore, leftScore];
		roundWinners = roundWinners.map((winner) => (winner === 'player1' ? 'player2' : 'player1'));
	}

	function openHistoryEntry(entry: GameHistoryEntry): void {
		selectedHistoryEntry = entry;
		isHistoryDialogOpen = true;
	}

	function startNewGame(): void {
		saveGameToHistory();
		leftScore = 0;
		rightScore = 0;
		round = 0;
		roundWinners = [];
		isWinnerDialogOpen = false;
		selectedHistoryEntry = null;
		isHistoryDialogOpen = false;
	}
</script>

<ThemeToggle class="absolute top-2 right-2" />

<WinnerDialog
	bind:open={isWinnerDialogOpen}
	{leftScore}
	{rightScore}
	{winner}
	onNewGame={startNewGame}
/>

<HistoryEntryDialog bind:open={isHistoryDialogOpen} entry={selectedHistoryEntry} />

<div class="flex h-screen flex-col gap-6 overflow-hidden px-6 py-8">
	<h1 class="self-center text-6xl font-bold text-primary">TTT</h1>

	<section class="flex flex-row items-center gap-2 self-center">
		<div class="flex items-center gap-1">
			<h2 class="font-regular text-lg">First to</h2>
			<Input
				bind:value={winningScoreInput}
				type="text"
				inputmode="numeric"
				pattern="[0-9]*"
				autocomplete="off"
				aria-label="Winning score"
				class="h-auto w-5 border-0 bg-transparent p-0 text-center text-lg font-semibold shadow-none focus-visible:outline-none"
				oninput={sanitizeWinningScoreInput}
			/>
		</div>
		•
		<div class="flex flex-row gap-1">
			<h2 class="font-regular text-lg">Round</h2>
			<p class="text-lg font-semibold">{round}</p>
		</div>
	</section>

	<div class="relative w-full max-w-md self-center">
		<div class="grid grid-cols-2 gap-8">
			<Tracker
				bind:name={player1Name}
				ariaLabel="Player 1 name"
				decreaseLabel="Decrease tracker 1"
				increaseLabel="Increase tracker 1"
				isServing={servingSide === 'left'}
				nameSuggestionsListId="saved-player-names"
				score={leftScore}
				onDecrease={() => updateLeftScore(-1)}
				onIncrease={() => updateLeftScore(1)}
			/>

			<Tracker
				bind:name={player2Name}
				ariaLabel="Player 2 name"
				decreaseLabel="Decrease tracker 2"
				increaseLabel="Increase tracker 2"
				isServing={servingSide === 'right'}
				nameSuggestionsListId="saved-player-names"
				score={rightScore}
				onDecrease={() => updateRightScore(-1)}
				onIncrease={() => updateRightScore(1)}
			/>
		</div>

		<div class="mt-4 px-2">
			<RoundIndicator rounds={roundWinners} />
		</div>

		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			class="absolute top-7 left-1/2 z-10 -translate-x-1/2"
			aria-label="Swap player sides"
			onclick={swapSides}
		>
			<ArrowLeftRight aria-hidden="true" />
		</Button>
	</div>

	<datalist id="saved-player-names">
		{#each savedPlayerNames as name}
			<option value={name}></option>
		{/each}
	</datalist>

	<div class="-mx-6 flex min-h-0 w-screen flex-1 flex-col gap-4 self-stretch">
		<div class="mx-auto flex w-full max-w-md flex-col gap-4">
			{#if winner}
				<div class="px-6">
					<Button type="button" class="w-full" onclick={startNewGame}>NEW GAME</Button>
				</div>
			{/if}

			{#if history.length > 0}
				<div class="px-6">
					<HeadToHead entries={history} {player1Name} {player2Name} />
				</div>
			{/if}
		</div>

		{#if history.length > 0}
			<div class="min-h-0 flex-1 self-stretch overflow-y-auto">
				<div class="mx-auto w-full max-w-md px-6">
					<HistoryList entries={history} onSelectEntry={openHistoryEntry} />
				</div>
			</div>
		{/if}
	</div>
</div>
