<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';

	import { Button } from '$lib/components/ui/button/index.js';

	export type TrackerProps = {
		ariaLabel: string;
		decreaseLabel: string;
		increaseLabel: string;
		isServing?: boolean;
		name: string;
		nameSuggestionsListId?: string;
		onDecrease: () => void;
		onIncrease: () => void;
		score: number;
	};

	let {
		ariaLabel,
		decreaseLabel,
		increaseLabel,
		isServing = false,
		name = $bindable(),
		nameSuggestionsListId,
		onDecrease,
		onIncrease,
		score
	}: TrackerProps = $props();

	function selectInputText(event: FocusEvent): void {
		(event.currentTarget as HTMLInputElement | null)?.select();
	}
</script>

<section class="flex flex-col items-center gap-5 p-2">
	<div class="flex flex-col gap-1">
		<div class="flex h-3 items-center justify-center" aria-hidden="true">
			{#if isServing}
				<span class="size-2.5 rounded-full bg-primary"></span>
			{/if}
		</div>
		<input
			bind:value={name}
			type="text"
			class="w-full border-0 bg-transparent p-0 text-center text-lg font-medium shadow-none outline-none focus-visible:outline-none"
			aria-label={ariaLabel}
			list={nameSuggestionsListId}
			onfocus={selectInputText}
		/>
	</div>
	<p class="text-5xl font-bold">{score}</p>
	<div class="flex gap-4">
		<Button
			type="button"
			variant="outline"
			size="icon-lg"
			class="size-16"
			aria-label={decreaseLabel}
			onclick={onDecrease}
		>
			<Minus aria-hidden="true" />
		</Button>
		<Button
			type="button"
			size="icon-lg"
			class="size-16"
			aria-label={increaseLabel}
			onclick={onIncrease}
		>
			<Plus aria-hidden="true" />
		</Button>
	</div>
</section>
