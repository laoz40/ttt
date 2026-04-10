<script lang="ts">
	import type { GameHistoryEntry } from '$lib/components/HistoryList.svelte';
	import { normalizePlayerName } from '$lib/history-storage.js';

	export type HeadToHeadProps = {
		entries: GameHistoryEntry[];
		player1Name: string;
		player2Name: string;
	};

	let { entries, player1Name, player2Name }: HeadToHeadProps = $props();

	const normalizedPlayer1Name = $derived(normalizePlayerName(player1Name).toLowerCase());
	const normalizedPlayer2Name = $derived(normalizePlayerName(player2Name).toLowerCase());
	const player1Wins = $derived(
		entries.filter((entry) => normalizePlayerName(entry.winnerName).toLowerCase() === normalizedPlayer1Name).length
	);
	const player2Wins = $derived(
		entries.filter((entry) => normalizePlayerName(entry.winnerName).toLowerCase() === normalizedPlayer2Name).length
	);
</script>

<section class="w-full max-w-md pt-4">
	<div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 pb-3">
		<p class="min-w-0 truncate text-sm font-medium text-muted-foreground">{player1Name}</p>
		<p class="text-3xl font-semibold">{player1Wins} - {player2Wins}</p>
		<p class="min-w-0 truncate text-right text-sm font-medium text-muted-foreground">{player2Name}</p>
	</div>
</section>
