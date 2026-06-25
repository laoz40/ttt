<script lang="ts">
	import Settings from '@lucide/svelte/icons/settings';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<ThemeToggle class="absolute top-4 left-6" />
<Button
	href="/settings"
	variant="outline"
	size="icon"
	class="absolute top-4 right-6"
	aria-label="Open settings"
>
	<Settings aria-hidden="true" />
</Button>
