<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';

	const { children } = $props();
</script>

<ModeWatcher themeColors={{ dark: '#111111', light: '#ffffff' }} />
{@render children()}
