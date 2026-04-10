<script lang="ts">
	import type { RoundWinner } from '$lib/components/RoundIndicator.svelte';

	export type GameHistoryEntry = {
		id: string;
		date: string;
		player1Name?: string;
		player1Score: number;
		player2Name?: string;
		player2Score: number;
		roundWinners?: RoundWinner[];
		winnerName: string;
	};

	export type HistoryListProps = {
		entries: GameHistoryEntry[];
		onSelectEntry: (entry: GameHistoryEntry) => void;
	};

	let { entries, onSelectEntry }: HistoryListProps = $props();
</script>

<section class="flex h-full min-h-0 w-full flex-col">
	<div class="mx-auto w-full max-w-md px-6">
		<div class="grid grid-cols-3 gap-4 border-b pb-2 text-xs font-light text-muted-foreground">
			<p>Winner</p>
			<p class="text-center">Score</p>
			<p class="text-right">Played at</p>
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto px-6">
		<ul class="mx-auto w-full max-w-md">
			{#each entries as entry (entry.id)}
				<li>
					<button
						type="button"
						class="grid w-full grid-cols-3 gap-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
						onclick={() => onSelectEntry(entry)}
					>
						<p class="min-w-0 truncate">{entry.winnerName}</p>
						<div class="text-center">
							<span class:font-black={entry.player1Score > entry.player2Score}>{entry.player1Score}</span>
							-
							<span class:font-black={entry.player2Score > entry.player1Score}>{entry.player2Score}</span>
						</div>
						<p class="min-w-0 truncate text-right">{entry.date}</p>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</section>
