<script lang="ts">
	import {
		getScoreHistoryExport,
		importScoreHistoryExport,
		validateScoreHistoryImport
	} from '$lib/history-storage.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	export type SettingsExportButtonsProps = {
		onExportComplete: (message: string) => void;
		status?: string;
	};

	let { onExportComplete, status = '' }: SettingsExportButtonsProps = $props();

	let fileInput: HTMLInputElement | null = $state(null);
	let pendingImportData: unknown = $state(null);
	let isImportDialogOpen = $state(false);

	// File actions
	function getExportFileName(name: string): string {
		return `ttt-${name}-${new Date().toISOString().slice(0, 10)}.json`;
	}

	function downloadJsonFile(fileName: string, data: unknown): void {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = fileName;
		link.click();

		URL.revokeObjectURL(url);
	}

	function resetImportInput(): void {
		if (!fileInput) return;

		fileInput.value = '';
	}

	// Export actions
	function exportScoreHistory(): void {
		downloadJsonFile(getExportFileName('score-history'), getScoreHistoryExport());
		onExportComplete('Score history exported.');
	}

	// Import actions
	function startImport(): void {
		fileInput?.click();
	}

	async function prepareImport(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement | null;
		const file = input?.files?.[0];

		if (!file) return;

		try {
			const importData = JSON.parse(await file.text()) as unknown;
			const validationResult = validateScoreHistoryImport(importData);

			if (!validationResult.success) {
				pendingImportData = null;
				onExportComplete(validationResult.message);
				return;
			}

			pendingImportData = importData;
			isImportDialogOpen = true;
		} catch {
			pendingImportData = null;
			onExportComplete('Invalid JSON file. Choose a valid TTT export file.');
		}

		resetImportInput();
	}

	function cancelImport(): void {
		pendingImportData = null;
		isImportDialogOpen = false;
	}

	function confirmImport(): void {
		const result = importScoreHistoryExport(pendingImportData);

		onExportComplete(result.message);

		if (result.success) {
			pendingImportData = null;
			isImportDialogOpen = false;
		}
	}
</script>

<div class="w-full max-w-md">
	<div class="flex flex-col gap-3">
		<Button type="button" variant="outline" class="w-full" onclick={exportScoreHistory}>
			Export score history as JSON
		</Button>

		<Button type="button" variant="outline" class="w-full" onclick={startImport}>
			Import score history from JSON
		</Button>
	</div>

	<input
		bind:this={fileInput}
		type="file"
		class="hidden"
		accept="application/json,.json"
		onchange={prepareImport}
	/>

	{#if status}
		<p class="mt-3 text-center text-sm text-muted-foreground">{status}</p>
	{/if}

	<Dialog.Root bind:open={isImportDialogOpen}>
		<Dialog.Content class="rounded-2xl">
			<Dialog.Header>
				<Dialog.Title>Replace score history?</Dialog.Title>
				<Dialog.Description>
					This will replace your current score history on this device with the imported data.
				</Dialog.Description>
			</Dialog.Header>

			<div class="flex gap-3 pt-2">
				<Button type="button" variant="outline" class="flex-1" onclick={cancelImport}>
					Cancel
				</Button>
				<Button type="button" variant="destructive" class="flex-1" onclick={confirmImport}>
					Import
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>
