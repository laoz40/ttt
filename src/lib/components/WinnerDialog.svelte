<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	export type WinnerDialogProps = {
		leftScore: number;
		onNewGame: () => void;
		open?: boolean;
		rightScore: number;
		winner: string | null;
	};

	let {
		leftScore,
		onNewGame,
		open = $bindable(false),
		rightScore,
		winner
	}: WinnerDialogProps = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="top-1/2 left-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
	>
		<Dialog.Header class="w-full min-w-0">
			<Dialog.Title
				class="flex w-full min-w-0 items-baseline justify-center gap-1 text-2xl leading-8 font-medium"
			>
				<span class="max-w-[calc(100%-3rem)] min-w-0 truncate text-right">{winner}</span>
				<span class="shrink-0">wins!</span>
			</Dialog.Title>
			<Dialog.Description class="flex w-full min-w-0 items-baseline justify-center gap-1">
				<span class="max-w-[calc(100%-8rem)] min-w-0 truncate text-right">{winner}</span>
				<span class="shrink-0">is simply better.</span>
			</Dialog.Description>
		</Dialog.Header>
		<p class="mt-4 text-center text-3xl">
			<span class="font-semibold">
				{leftScore}
			</span>
			-
			<span class="font-semibold">
				{rightScore}
			</span>
		</p>
		<div class="mt-4 flex justify-center">
			<Dialog.Close
				type="button"
				class={buttonVariants({ variant: 'default', size: 'lg' })}
				onclick={onNewGame}
			>
				SAVE TO HISTORY
			</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
