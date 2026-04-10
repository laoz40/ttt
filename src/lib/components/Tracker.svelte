<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';

	import { Button } from '$lib/components/ui/button/index.js';

	export type TrackerProps = {
		ariaLabel: string;
		decreaseLabel: string;
		increaseLabel: string;
		name: string;
		onDecrease: () => void;
		onIncrease: () => void;
		score: number;
	};

	let { ariaLabel, decreaseLabel, increaseLabel, name = $bindable(), onDecrease, onIncrease, score }: TrackerProps =
		$props();
</script>

<section class="flex flex-col items-center gap-5 p-2">
	<input
		bind:value={name}
		type="text"
		class="w-full bg-transparent text-center text-lg font-medium outline-none border-0 p-0 shadow-none focus-visible:outline-none"
		aria-label={ariaLabel}
	/>
	<p class="text-5xl font-bold">{score}</p>
	<div class="flex gap-4">
		<Button
			type="button"
			variant="outline"
			size="icon-lg"
			class="size-14"
			aria-label={decreaseLabel}
			onclick={onDecrease}
		>
			<Minus aria-hidden="true" />
		</Button>
		<Button
			type="button"
			size="icon-lg"
			class="size-14"
			aria-label={increaseLabel}
			onclick={onIncrease}
		>
			<Plus aria-hidden="true" />
		</Button>
	</div>
</section>
