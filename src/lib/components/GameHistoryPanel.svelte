<script lang="ts">
	import HeadToHead from '$lib/components/HeadToHead.svelte';
	import HistoryList, { type GameHistoryEntry } from '$lib/components/HistoryList.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	export type GameHistoryPanelProps = {
		entries: GameHistoryEntry[];
		player1Name: string;
		player2Name: string;
		hasWinner: boolean;
		onNewGame: () => void;
		onSelectEntry: (entry: GameHistoryEntry) => void;
	};

	let {
		entries,
		player1Name,
		player2Name,
		hasWinner,
		onNewGame,
		onSelectEntry
	}: GameHistoryPanelProps = $props();
</script>

<div class="-mx-6 flex min-h-0 w-screen flex-1 flex-col gap-4 self-stretch overflow-hidden">
	<div class="mx-auto flex w-full max-w-md flex-col gap-4 px-6">
		{#if hasWinner}
			<div>
				<Button type="button" class="w-full h-12 text-xl" onclick={onNewGame}>SAVE TO HISTORY</Button>
			</div>
		{/if}

		<HeadToHead {entries} {player1Name} {player2Name} />
	</div>

	{#if entries.length > 0}
		<div class="min-h-0 flex-1 self-stretch">
			<HistoryList {entries} {onSelectEntry} />
		</div>
	{:else}
		<div
			class="mx-auto flex w-full max-w-md flex-1 items-start justify-center px-6 text-xs text-muted-foreground"
		>
			No games recorded between these opponents.
		</div>
	{/if}
</div>
