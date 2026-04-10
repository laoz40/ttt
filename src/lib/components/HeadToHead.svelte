<script lang="ts">
	import type { GameHistoryEntry } from '$lib/components/HistoryList.svelte';

	export type HeadToHeadProps = {
		entries: GameHistoryEntry[];
	};

	const player1Name = 'Player 1';
	const player2Name = 'Player 2';

	let { entries }: HeadToHeadProps = $props();

	const player1Wins = $derived(entries.filter((entry) => entry.winnerName === player1Name).length);
	const player2Wins = $derived(entries.filter((entry) => entry.winnerName === player2Name).length);
</script>

<section class="w-full max-w-md pt-4">
	<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pb-3">
		<p class="text-sm font-medium text-muted-foreground">{player1Name}</p>
		<p class="text-3xl font-semibold">{player1Wins} - {player2Wins}</p>
		<p class="text-right text-sm font-medium text-muted-foreground">{player2Name}</p>
	</div>
</section>
