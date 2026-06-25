<script lang="ts">
	import { browser } from '$app/environment';
	import GameHistoryPanel from '$lib/components/GameHistoryPanel.svelte';
	import GameStatusBar from '$lib/components/GameStatusBar.svelte';
	import HistoryEntryDialog from '$lib/components/HistoryEntryDialog.svelte';
	import type { GameHistoryEntry } from '$lib/components/HistoryList.svelte';
	import PageActions from '$lib/components/PageActions.svelte';
	import RoundIndicator, { type RoundWinner } from '$lib/components/RoundIndicator.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';
	import WinnerDialog from '$lib/components/WinnerDialog.svelte';
	import {
		calculateServingSide,
		calculateWinner,
		formatHistoryDate,
		formatHistoryTime
	} from '$lib/game-utils.js';
	import {
		getHistoryStorageKey,
		getSavedPlayerNames,
		normalizePlayerName,
		saveSavedPlayerNames
	} from '$lib/history-storage.js';

	const defaultPlayer1Name = 'Player 1';
	const defaultPlayer2Name = 'Player 2';
	const defaultWinningScore = 11;

	type StoredHistoryEntry = Partial<GameHistoryEntry> & { id?: string };

	// Player and score state
	let player1Name = $state('');
	let player2Name = $state('');
	let round = $state(0);
	let leftScore = $state(0);
	let rightScore = $state(0);
	let roundWinners = $state<RoundWinner[]>([]);

	// Game settings and side overrides
	let winningScoreInput = $state(String(defaultWinningScore));
	let areSidesSwapped = $state(false);
	let isServingSideSwapped = $state(false);

	// Dialog and history state
	let isWinnerDialogOpen = $state(false);
	let history = $state<GameHistoryEntry[]>([]);
	let selectedHistoryEntry = $state<GameHistoryEntry | null>(null);
	let isHistoryDialogOpen = $state(false);
	let loadedHistoryKey = $state<string | null>(null);
	let savedPlayerNames = $state<string[]>([]);

	const player1NameValue = $derived(normalizePlayerName(player1Name) || defaultPlayer1Name);
	const player2NameValue = $derived(normalizePlayerName(player2Name) || defaultPlayer2Name);
	const historyStorageKey = $derived(getHistoryStorageKey(player1NameValue, player2NameValue));
	const targetScore = $derived.by(() => getTargetScore(winningScoreInput));
	const winner = $derived(
		calculateWinner(leftScore, rightScore, player1NameValue, player2NameValue, targetScore)
	);
	const servingSide = $derived.by(() => {
		let currentServingSide = calculateServingSide(leftScore, rightScore, targetScore);

		if (areSidesSwapped) {
			currentServingSide = currentServingSide === 'left' ? 'right' : 'left';
		}

		if (isServingSideSwapped) {
			currentServingSide = currentServingSide === 'left' ? 'right' : 'left';
		}

		return currentServingSide;
	});

	function getTargetScore(value: string): number {
		const parsed = Number.parseInt(value, 10);

		return Number.isFinite(parsed) && parsed >= 1 ? parsed : defaultWinningScore;
	}

	function createHistoryEntryId(): string {
		return typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: `history-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	}

	function normalizeHistoryEntry(entry: StoredHistoryEntry): GameHistoryEntry {
		return {
			id: entry.id ?? createHistoryEntryId(),
			date: entry.time ? (entry.date ?? formatHistoryDate(new Date())) : '',
			time: entry.time ?? '',
			legacyPlayedAt: entry.time ? undefined : entry.date,
			player1Name: normalizePlayerName(entry.player1Name ?? '') || defaultPlayer1Name,
			player1Score: entry.player1Score ?? 0,
			player2Name: normalizePlayerName(entry.player2Name ?? '') || defaultPlayer2Name,
			player2Score: entry.player2Score ?? 0,
			roundWinners: entry.roundWinners ?? [],
			winnerName: normalizePlayerName(entry.winnerName ?? '') || defaultPlayer1Name
		};
	}

	function loadStoredHistory(key: string): GameHistoryEntry[] {
		const storedHistory = localStorage.getItem(key);

		if (!storedHistory) return [];

		try {
			const parsedHistory = JSON.parse(storedHistory) as unknown;

			return Array.isArray(parsedHistory) ? parsedHistory.map(normalizeHistoryEntry) : [];
		} catch {
			return [];
		}
	}

	// Load saved player names from local storage.
	$effect(() => {
		if (!browser) return;

		savedPlayerNames = getSavedPlayerNames();
	});

	// Keep winner dialog synced with the current score.
	$effect(() => {
		isWinnerDialogOpen = Boolean(winner);
	});

	// Load history whenever the active player pair changes.
	$effect(() => {
		if (!browser) return;

		const key = historyStorageKey;

		if (!key) {
			history = [];
			loadedHistoryKey = null;
			return;
		}

		history = loadStoredHistory(key);
		loadedHistoryKey = key;
	});

	// Save history after it has been loaded for the active player pair.
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
			if (nextRoundWinners[index] !== winner) continue;

			nextRoundWinners.splice(index, 1);
			remaining -= 1;
		}

		roundWinners = nextRoundWinners;
	}

	function applyScoreChange(winner: RoundWinner, currentScore: number, value: number): number {
		const nextScore = Math.max(0, currentScore + value);
		const scoreChange = nextScore - currentScore;

		round += scoreChange;

		if (scoreChange > 0) {
			addRoundWinner(winner, scoreChange);
			return nextScore;
		}

		if (scoreChange < 0) {
			removeRoundWinner(winner, Math.abs(scoreChange));
		}

		return nextScore;
	}

	function updateLeftScore(value: number): void {
		leftScore = applyScoreChange('player1', leftScore, value);
	}

	function updateRightScore(value: number): void {
		rightScore = applyScoreChange('player2', rightScore, value);
	}

	function saveGameToHistory(): void {
		if (!winner) return;

		savedPlayerNames = saveSavedPlayerNames([player1NameValue, player2NameValue]);
		const now = new Date();

		history = [
			{
				id: createHistoryEntryId(),
				date: formatHistoryDate(now),
				time: formatHistoryTime(now),
				player1Name: player1NameValue,
				player1Score: leftScore,
				player2Name: player2NameValue,
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
		areSidesSwapped = !areSidesSwapped;
	}

	function swapServingSide(): void {
		isServingSideSwapped = !isServingSideSwapped;
	}

	function openHistoryEntry(entry: GameHistoryEntry): void {
		selectedHistoryEntry = entry;
		isHistoryDialogOpen = true;
	}

	function deleteHistoryEntry(entry: GameHistoryEntry): void {
		history = history.filter((historyEntry) => historyEntry.id !== entry.id);

		if (selectedHistoryEntry?.id !== entry.id) return;

		selectedHistoryEntry = null;
		isHistoryDialogOpen = false;
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

<PageActions />

<WinnerDialog
	bind:open={isWinnerDialogOpen}
	{leftScore}
	{rightScore}
	{winner}
	onNewGame={startNewGame}
/>

<HistoryEntryDialog
	bind:open={isHistoryDialogOpen}
	entry={selectedHistoryEntry}
	onDeleteEntry={deleteHistoryEntry}
/>

<div class="flex h-dvh flex-col gap-4 overflow-hidden bg-background px-6 py-8">
	<h1 class="self-center text-6xl font-bold text-primary">TTT</h1>

	<GameStatusBar bind:winningScoreInput {round} />

	<Scoreboard
		bind:player1Name
		bind:player2Name
		{leftScore}
		{rightScore}
		{servingSide}
		{savedPlayerNames}
		{defaultPlayer1Name}
		{defaultPlayer2Name}
		onDecreaseLeft={() => updateLeftScore(-1)}
		onIncreaseLeft={() => updateLeftScore(1)}
		onDecreaseRight={() => updateRightScore(-1)}
		onIncreaseRight={() => updateRightScore(1)}
		onSwapSides={swapSides}
		onSwapServingSide={swapServingSide}
	/>

	<div class="my-6 w-full max-w-md self-center px-6">
		<RoundIndicator rounds={roundWinners} />
	</div>

	<GameHistoryPanel
		entries={history}
		player1Name={player1NameValue}
		player2Name={player2NameValue}
		hasWinner={Boolean(winner)}
		onNewGame={startNewGame}
		onSelectEntry={openHistoryEntry}
	/>
</div>
