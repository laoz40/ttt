<script lang="ts">
	import Minus from "@lucide/svelte/icons/minus";
	import Plus from "@lucide/svelte/icons/plus";

	import { Button } from "$lib/components/ui/button/index.js";

	export type TrackerProps = {
		decreaseLabel: string;
		increaseLabel: string;
		onDecrease: () => void;
		onIncrease: () => void;
		score: number;
		title: string;
	};

	let {
		decreaseLabel,
		increaseLabel,
		onDecrease,
		onIncrease,
		score,
		title,
	}: TrackerProps = $props();
</script>

<section class="flex flex-col items-center gap-5 p-2">
	<h2 class="text-lg font-medium">{title}</h2>
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
