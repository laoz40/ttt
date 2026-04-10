<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import RoundIndicator from '$lib/components/RoundIndicator.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { normalizePlayerName } from '$lib/history-storage.js';
	import type { GameHistoryEntry } from '$lib/components/HistoryList.svelte';

	export type HistoryEntryDialogProps = {
		entry: GameHistoryEntry | null;
		open?: boolean;
	};

	let { entry, open = $bindable(false) }: HistoryEntryDialogProps = $props();
</script>

<Dialog.Root bind:open={open}>
	{#if entry}
		<Dialog.Content class="left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl p-0">
			<div class="flex max-h-[calc(100vh-2rem)] w-full min-w-0 flex-col gap-5 overflow-hidden p-6">
				<Dialog.Header class="w-full min-w-0">
					<Dialog.Title class="text-center text-2xl font-medium leading-6">Game details</Dialog.Title>
					<Dialog.Description class="text-center">{entry.date}</Dialog.Description>
				</Dialog.Header>

				<div class="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
					<p class="min-w-0 truncate text-left text-sm font-medium text-muted-foreground">
						{entry.player1Name ?? 'Player 1'}
					</p>
					<p class="shrink-0 text-center text-3xl font-regular">
						<span
							class:font-black={normalizePlayerName(entry.winnerName).toLowerCase() ===
								normalizePlayerName(entry.player1Name ?? 'Player 1').toLowerCase()}
						>
							{entry.player1Score}
						</span>
						-
						<span
							class:font-black={normalizePlayerName(entry.winnerName).toLowerCase() ===
								normalizePlayerName(entry.player2Name ?? 'Player 2').toLowerCase()}
						>
							{entry.player2Score}
						</span>
					</p>
					<p class="min-w-0 truncate text-right text-sm font-medium text-muted-foreground">
						{entry.player2Name ?? 'Player 2'}
					</p>
				</div>

				<div class="mt-5 w-full min-w-0">
					<RoundIndicator rounds={entry.roundWinners ?? []} />
				</div>

				<div class="mt-6 flex justify-center">
					<Dialog.Close type="button" class={buttonVariants({ variant: 'default' })}>
						Close
					</Dialog.Close>
				</div>
			</div>
		</Dialog.Content>
	{/if}
</Dialog.Root>
