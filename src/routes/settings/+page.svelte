<script lang="ts">
	import { clearAllHistory } from '$lib/history-storage.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let isCleared = $state(false);

	function handleClearHistory(): void {
		clearAllHistory();
		isCleared = true;
	}
</script>

<div class="flex min-h-screen flex-col items-center gap-6 px-6 py-8">
	<h1 class="text-4xl font-bold">Settings</h1>

	<Button type="button" variant="destructive" class="w-full max-w-md" onclick={handleClearHistory}>
		Clear all history
	</Button>

	{#if isCleared}
		<p class="text-sm text-muted-foreground">History cleared.</p>
	{/if}

	<Button href="/" variant="ghost" class="w-full max-w-md">Back</Button>
</div>
