<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';

	export type GameStatusBarProps = {
		round: number;
		winningScoreInput?: string;
	};

	let { round, winningScoreInput = $bindable('11') }: GameStatusBarProps = $props();

	function selectInputText(event: FocusEvent | MouseEvent): void {
		(event.currentTarget as HTMLInputElement | null)?.select();
	}

	function sanitizeWinningScoreInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement | null;

		if (!input) return;

		const nextValue = input.value.replace(/\D+/g, '');

		winningScoreInput = nextValue;
		input.value = nextValue;
	}
</script>

<section class="flex flex-row items-center gap-2 self-center">
	<div class="flex items-center gap-1">
		<h2 class="font-regular text-base">First to</h2>
		<Input
			bind:value={winningScoreInput}
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			autocomplete="off"
			aria-label="Winning score"
			class="h-auto w-5 border-0 bg-transparent p-0 text-center text-base font-semibold shadow-none focus-visible:outline-none"
			onclick={selectInputText}
			onfocus={selectInputText}
			oninput={sanitizeWinningScoreInput}
		/>
	</div>
	•
	<div class="flex flex-row gap-1">
		<h2 class="font-regular text-base">Round</h2>
		<p class="text-base font-semibold">{round}</p>
	</div>
</section>
