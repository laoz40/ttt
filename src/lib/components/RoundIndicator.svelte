<script lang="ts">
	export type RoundWinner = 'player1' | 'player2';

	export type RoundIndicatorProps = {
		rounds: RoundWinner[];
	};

	let { rounds }: RoundIndicatorProps = $props();
</script>

<section class="w-full overflow-x-auto" aria-label="Round point indicator">
	<div class="flex min-h-4 justify-start gap-1">
		{#each rounds as round}
			<div class="flex h-4 w-4 items-end justify-center">
				{#if round === 'player1'}
					<span class="h-2 w-full rounded-full bg-primary"></span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="my-1 h-px w-full bg-primary"></div>

	<div class="flex min-h-4 justify-start gap-1">
		{#each rounds as round}
			<div class="flex h-4 w-4 items-start justify-center">
				{#if round === 'player2'}
					<span class="h-2 w-full rounded-full bg-primary"></span>
				{/if}
			</div>
		{/each}
	</div>
</section>
