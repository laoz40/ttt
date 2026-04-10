<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { Snippet } from "svelte";

	import { cn, type WithElementRef, type WithoutChild } from "$lib/utils.js";

	type Props = WithElementRef<WithoutChild<Dialog.TitleProps>> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<Dialog.Title bind:ref class={cn("text-lg font-semibold", className)} {...restProps}>
	{@render children?.()}
</Dialog.Title>
