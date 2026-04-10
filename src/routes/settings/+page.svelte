<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode, mode } from 'mode-watcher';
	import { clearAllHistory } from '$lib/history-storage.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let isCleared = $state(false);
	let isDeleteDialogOpen = $state(false);

	function handleClearHistory(): void {
		clearAllHistory();
		isCleared = true;
		isDeleteDialogOpen = false;
	}
</script>

<Button href="/" variant="outline" size="icon" class="absolute top-4 left-6">
	<ArrowLeft />
</Button>

<div class="flex min-h-dvh flex-col items-center gap-6 px-6 py-8">
	<h1 class="text-4xl font-bold">Settings</h1>

	<Button type="button" variant="outline" class="w-full max-w-md" onclick={toggleMode}>
		{#if mode.current === 'dark'}
			<SunIcon class="size-4" />
			<span>Switch to light mode</span>
		{:else}
			<MoonIcon class="size-4" />
			<span>Switch to dark mode</span>
		{/if}
	</Button>

	<Button type="button" variant="destructive" class="w-full max-w-md" onclick={() => (isDeleteDialogOpen = true)}>
		Delete all evidence
	</Button>

	{#if isCleared}
		<p class="text-sm text-muted-foreground">History cleared.</p>
	{/if}

	<Dialog.Root bind:open={isDeleteDialogOpen}>
		<Dialog.Content class="rounded-2xl">
			<Dialog.Header>
				<Dialog.Title>Delete all history?</Dialog.Title>
				<Dialog.Description>
					This will permanently remove your saved match history and saved players from this device.
				</Dialog.Description>
			</Dialog.Header>

			<div class="flex gap-3 pt-2">
				<Button type="button" variant="outline" class="flex-1" onclick={() => (isDeleteDialogOpen = false)}>
					Cancel
				</Button>
				<Button type="button" variant="destructive" class="flex-1" onclick={handleClearHistory}>
					Delete
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>

	<p class="mt-auto text-center text-balance text-sm text-muted-foreground">
		Made by the greatest table tennis player of all time,
		<a href="https://github.com/laoz40" target="_blank" rel="noreferrer" class="text-primary">
			Leo Zhou
		</a>
	</p>
</div>
