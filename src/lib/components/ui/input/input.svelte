<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	import { cn, type WithElementRef } from "$lib/utils.js";

	type Props = WithElementRef<HTMLInputAttributes> & {
		class?: string;
	};

	let { class: className, ref = $bindable(null), value = $bindable(''), ...restProps }: Props = $props();
</script>

<input
	bind:this={ref}
	bind:value={value}
	data-slot="input"
	class={cn(
		"border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
		className
	)}
	{...restProps}
/>
