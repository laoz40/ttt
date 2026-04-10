<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { Snippet } from "svelte";

	import { cn, type WithElementRef, type WithoutChild } from "$lib/utils.js";

	type Props = WithElementRef<WithoutChild<Dialog.DescriptionProps>> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<Dialog.Description bind:ref class={cn("text-muted-foreground text-sm", className)} {...restProps}>
	{@render children?.()}
</Dialog.Description>
