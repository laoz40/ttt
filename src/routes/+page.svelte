<script lang="ts">
	import { browser } from '$app/environment';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import HeadToHead from '$lib/components/HeadToHead.svelte';
	import HistoryList, { type GameHistoryEntry } from '$lib/components/HistoryList.svelte';
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
	let loadedHistoryKey = $state<string | null>(null);
	let savedPlayerNames = $state<string[]>([]);

	const historyStorageKey = $derived(getHistoryStorageKey(player1Name, player2Name));
	const targetScore = $derived.by(() => {
		const parsed = Number.parseInt(winningScoreInput, 10);

		return Number.isFinite(parsed) && parsed >= 1 ? parsed : 11;
	});
	const winner = $derived(calculateWinner(leftScore, rightScore, player1Name, player2Name, targetScore));
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
			history = Array.isArray(parsedHistory) ? (parsedHistory as GameHistoryEntry[]) : [];
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
				player1Score: leftScore,
				player2Score: rightScore,
				winnerName: winner
			},
			...history
		];
	}

	function swapSides(): void {
		[player1Name, player2Name] = [player2Name, player1Name];
		[leftScore, rightScore] = [rightScore, leftScore];
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

<div class="flex h-screen flex-col gap-6 overflow-hidden px-6 py-8">
	<h1 class="self-center text-6xl font-bold">TTT</h1>

	<section class="self-center flex flex-row items-center gap-2">
		<div class="flex items-center gap-1">
			<h2 class="text-lg font-regular">First to</h2>
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
			<h2 class="text-lg font-regular">Round</h2>
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

		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			class="absolute top-8 left-1/2 z-10 -translate-x-1/2"
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

	<div class="flex w-screen min-h-0 flex-1 flex-col gap-4 self-stretch -mx-6">
		<div class="mx-auto flex w-full max-w-md flex-col gap-4">
			{#if winner}
				<Button type="button" class="w-full" onclick={startNewGame}>New game</Button>
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
					<HistoryList entries={history} />
				</div>
			</div>
		{/if}
	</div>
</div>
