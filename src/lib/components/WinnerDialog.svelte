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

	let { leftScore, onNewGame, open = $bindable(false), rightScore, winner }: WinnerDialogProps = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-xs rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl leading-6 font-medium">{winner} wins!</Dialog.Title>
			<Dialog.Description>{winner} is simply better.</Dialog.Description>
		</Dialog.Header>
		<p class="mt-4 text-center text-sm text-gray-500">
			<span class="font-semibold">
				{leftScore}
			</span>
			-
			<span class="font-semibold">
				{rightScore}
			</span>
		</p>
		<div class="mt-4 flex justify-center">
			<Dialog.Close type="button" class={buttonVariants({ variant: 'default' })} onclick={onNewGame}>
				New Game
			</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
