<script lang="ts">
	export type GameHistoryEntry = {
		date: string;
		player1Score: number;
		player2Score: number;
		winnerName: string;
	};

	export type HistoryListProps = {
		entries: GameHistoryEntry[];
	};

	let { entries }: HistoryListProps = $props();
</script>

<section class="w-full max-w-md">
	<div class="grid grid-cols-3 gap-4 border-b pb-2 text-xs font-light text-muted-foreground">
		<p>Winner</p>
		<p class="text-center">Score</p>
		<p class="text-right">Played at</p>
	</div>

	<ul class="mt-3 space-y-3">
		{#each entries as entry}
			<li class="grid grid-cols-3 gap-4 text-sm">
				<p>{entry.winnerName}</p>
				<div class="text-center">
					<span class:font-bold={entry.player1Score > entry.player2Score}>{entry.player1Score}</span>
					-
					<span class:font-bold={entry.player2Score > entry.player1Score}>{entry.player2Score}</span>
				</div>
				<p class="text-right">{entry.date}</p>
			</li>
		{/each}
	</ul>
</section>
