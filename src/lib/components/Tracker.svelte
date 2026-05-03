<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { AnimatedButton } from '$lib/components/ui/animated-button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	export type TrackerProps = {
		ariaLabel: string;
		decreaseLabel: string;
		increaseLabel: string;
		isServing?: boolean;
		name: string;
		nameSuggestionsListId?: string;
		placeholder?: string;
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
		placeholder,
		onDecrease,
		onIncrease,
		score
	}: TrackerProps = $props();

	function selectInputText(event: FocusEvent | MouseEvent): void {
		(event.currentTarget as HTMLInputElement | null)?.select();
	}

	const tapSpringTransition = {
		type: 'spring' as const,
		stiffness: 520,
		damping: 12,
		mass: 0.55
	};

	const tapAnimation = { scale: 0.78 };
	const noHoverAnimation = {};
</script>

<section class="flex flex-col items-center gap-5 p-2">
	<div class="flex flex-col gap-1">
		<div class="flex h-3 items-center justify-center" aria-hidden="true">
			{#if isServing}
				<span class="size-2.5 rounded-full bg-primary"></span>
			{/if}
		</div>
		<Input
			bind:value={name}
			type="text"
			class="border-0 bg-transparent p-0 text-center text-2xl font-medium shadow-none focus-visible:outline-none"
			aria-label={ariaLabel}
			list={nameSuggestionsListId}
			placeholder={placeholder}
			onclick={selectInputText}
			onfocus={selectInputText}
		/>
	</div>
	<p class="text-5xl font-bold">{score}</p>
	<div class="flex gap-4">
		<AnimatedButton
			whileHover={noHoverAnimation}
			whileTap={tapAnimation}
			transition={tapSpringTransition}
			type="button"
			variant="secondary"
			size="icon-lg"
			class="size-16 sphere-button sphere-button--decrease"
			aria-label={decreaseLabel}
			onclick={onDecrease}
		>
			<Minus aria-hidden="true" />
		</AnimatedButton>
		<AnimatedButton
			whileHover={noHoverAnimation}
			whileTap={tapAnimation}
			transition={tapSpringTransition}
			type="button"
			size="icon-lg"
			class="size-16 sphere-button sphere-button--increase"
			aria-label={increaseLabel}
			onclick={onIncrease}
		>
			<Plus aria-hidden="true" />
		</AnimatedButton>
	</div>
</section>

<style>
	:global(.sphere-button) {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		border: 0 !important;
		border-radius: 9999px !important;
		box-shadow:
			0 10px 16px rgba(0, 0, 0, 0.12),
			0 3px 5px rgba(0, 0, 0, 0.06),
			inset 0 1px 1px rgba(255, 255, 255, 0.18),
			inset 0 -5px 8px rgba(0, 0, 0, 0.08) !important;
		transition:
			box-shadow 150ms ease,
			filter 150ms ease;
	}

	:global(.sphere-button::before) {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.14) 16%, rgba(255, 255, 255, 0.06) 28%, rgba(255, 255, 255, 0) 46%);
		opacity: 0.7;
	}

	:global(.sphere-button::after) {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(circle at 62% 68%, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.08) 18%, rgba(0, 0, 0, 0) 55%);
		opacity: 0.8;
	}

	:global(.sphere-button--decrease) {
		background-color: hsl(var(--background)) !important;
		color: hsl(var(--foreground)) !important;
		background-image:
			radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.18) 16%, rgba(255, 255, 255, 0.05) 28%, rgba(255, 255, 255, 0) 46%),
			radial-gradient(circle at 62% 68%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.06) 18%, rgba(0, 0, 0, 0) 55%),
			radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.06) 100%);
	}

	:global(.dark .sphere-button--decrease) {
		background-color: hsl(0 0% 100%) !important;
		color: hsl(0 0% 14%) !important;
	}

	:global(.sphere-button--increase) {
		background-color: hsl(38 100% 50%) !important;
		color: hsl(0 0% 14%) !important;
		background-image:
			radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.12) 16%, rgba(255, 255, 255, 0.04) 28%, rgba(255, 255, 255, 0) 46%),
			radial-gradient(circle at 62% 68%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.06) 18%, rgba(0, 0, 0, 0) 55%),
			radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.08) 100%);
	}
</style>
