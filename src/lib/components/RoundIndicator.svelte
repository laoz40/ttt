<script lang="ts">
	export type RoundWinner = 'player1' | 'player2';

	export type RoundIndicatorProps = {
		rounds: RoundWinner[];
	};

	let { rounds }: RoundIndicatorProps = $props();
	let scrollContainer: HTMLElement | null = null;

	$effect(() => {
		rounds;
		scrollContainer?.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
	});
</script>

<section
	bind:this={scrollContainer}
	class="w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
	aria-label="Round point indicator"
>
	<div class="min-w-max">
		<div class="flex min-h-4 justify-start gap-1">
			{#each rounds as round}
				<div class="flex h-4 w-4 flex-none items-end justify-center">
					{#if round === 'player1'}
						<span class="h-4 w-full rounded-full bg-primary"></span>
					{/if}
				</div>
			{/each}
		</div>

		<div class="my-1 h-px w-full bg-primary"></div>

		<div class="flex min-h-4 justify-start gap-1">
			{#each rounds as round}
				<div class="flex h-4 w-4 flex-none items-start justify-center">
					{#if round === 'player2'}
						<span class="h-4 w-full rounded-full bg-primary"></span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:global(.scrollbar-hide) {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	:global(.scrollbar-hide::-webkit-scrollbar) {
		display: none;
	}
</style>
