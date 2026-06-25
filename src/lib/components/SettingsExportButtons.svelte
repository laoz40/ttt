<script lang="ts">
	import { getScoreHistoryExport } from '$lib/history-storage.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export type SettingsExportButtonsProps = {
		onExportComplete: (message: string) => void;
		status?: string;
	};

	let { onExportComplete, status = '' }: SettingsExportButtonsProps = $props();

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

	// Export actions
	function exportScoreHistory(): void {
		downloadJsonFile(getExportFileName('score-history'), getScoreHistoryExport());
		onExportComplete('Score history exported.');
	}
</script>

<div class="w-full max-w-md">
	<Button type="button" variant="outline" class="w-full" onclick={exportScoreHistory}>
		Export score history as JSON
	</Button>

	{#if status}
		<p class="mt-3 text-center text-sm text-muted-foreground">{status}</p>
	{/if}
</div>
