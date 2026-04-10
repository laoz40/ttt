<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	import { cn, type WithElementRef } from "$lib/utils.js";

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		class?: string;
	};

	let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<div bind:this={ref} class={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...restProps}>
	{@render children?.()}
</div>
