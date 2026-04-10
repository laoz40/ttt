<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { Snippet } from "svelte";

	import { cn, type WithoutChild } from "$lib/utils.js";

	type Props = WithoutChild<Dialog.ContentProps> & {
		class?: string;
		children?: Snippet;
	};

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: Props = $props();
</script>

<Dialog.Portal>
	<Dialog.Overlay class="fixed inset-0 z-50 bg-background/80" />
	<Dialog.Content
		bind:ref
		class={cn(
			"bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg sm:rounded-lg",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</Dialog.Content>
</Dialog.Portal>
