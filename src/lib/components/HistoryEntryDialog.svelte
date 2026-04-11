<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import RoundIndicator from '$lib/components/RoundIndicator.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { normalizePlayerName } from '$lib/history-storage.js';
	import type { GameHistoryEntry } from '$lib/components/HistoryList.svelte';

	const defaultPlayer1Name = 'Player 1';
	const defaultPlayer2Name = 'Player 2';

	export type HistoryEntryDialogProps = {
		entry: GameHistoryEntry | null;
		open?: boolean;
		onDeleteEntry: (entry: GameHistoryEntry) => void;
	};

	let { entry, open = $bindable(false), onDeleteEntry }: HistoryEntryDialogProps = $props();

	let isDeleteDialogOpen = $state(false);

	function handleDeleteEntry(): void {
		if (!entry) return;

		onDeleteEntry(entry);
		isDeleteDialogOpen = false;
	}

	function getPlayerName(value: string | undefined, fallback: string): string {
		return normalizePlayerName(value ?? '') || fallback;
	}

	function getPlayedAtDetails(entry: GameHistoryEntry): string {
		if (entry.date && entry.time) {
			return `${entry.date} • ${entry.time}`;
		}

		if (entry.date) {
			return entry.date;
		}

		if (entry.time) {
			return entry.time;
		}

		return entry.legacyPlayedAt ?? '';
	}
</script>

<Dialog.Root bind:open={open}>
	{#if entry}
		<Dialog.Content class="left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl p-0">
			<div class="flex max-h-[calc(100vh-2rem)] w-full min-w-0 flex-col gap-5 overflow-hidden p-6">
				<Dialog.Header class="w-full min-w-0">
					<Dialog.Title class="text-center text-2xl font-medium leading-6">Game details</Dialog.Title>
					<Dialog.Description class="text-center">{getPlayedAtDetails(entry)}</Dialog.Description>
				</Dialog.Header>

				<div class="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
					<p class="min-w-0 truncate text-left text-sm font-medium text-muted-foreground">
						{getPlayerName(entry.player1Name, defaultPlayer1Name)}
					</p>
					<p class="shrink-0 text-center text-3xl font-regular">
						<span
							class:font-black={normalizePlayerName(entry.winnerName).toLowerCase() ===
								normalizePlayerName(getPlayerName(entry.player1Name, defaultPlayer1Name)).toLowerCase()}
						>
							{entry.player1Score}
						</span>
						-
						<span
							class:font-black={normalizePlayerName(entry.winnerName).toLowerCase() ===
								normalizePlayerName(getPlayerName(entry.player2Name, defaultPlayer2Name)).toLowerCase()}
						>
							{entry.player2Score}
						</span>
					</p>
					<p class="min-w-0 truncate text-right text-sm font-medium text-muted-foreground">
						{getPlayerName(entry.player2Name, defaultPlayer2Name)}
					</p>
				</div>

				<div class="mt-5 w-full min-w-0">
					<RoundIndicator rounds={entry.roundWinners ?? []} />
				</div>

				<div class="mt-6 flex items-center justify-between gap-3">
					<Button type="button" variant="destructive" onclick={() => (isDeleteDialogOpen = true)}>
						Delete evidence
					</Button>
					<Dialog.Close type="button" class={buttonVariants({ variant: 'default' })}>
						Close
					</Dialog.Close>
				</div>
			</div>
		</Dialog.Content>
	{/if}
</Dialog.Root>

<Dialog.Root bind:open={isDeleteDialogOpen}>
	<Dialog.Overlay class="fixed inset-0 bg-background/80" style="z-index: 60;" />
	<Dialog.Content class="rounded-2xl" style="z-index: 60;">
		<Dialog.Header>
			<Dialog.Title>Delete from history?</Dialog.Title>
			<Dialog.Description>
				This will permanently remove this match from your saved history. Was it that embarrassing?
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex gap-3 pt-2">
			<Button type="button" variant="outline" class="flex-1" onclick={() => (isDeleteDialogOpen = false)}>
				Cancel
			</Button>
			<Button type="button" variant="destructive" class="flex-1" onclick={handleDeleteEntry}>
				Delete evidence
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
