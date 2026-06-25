<script lang="ts">
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import Tracker from '$lib/components/Tracker.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu/index.js';
	import type { ServingSide } from '$lib/game-utils.js';

	export type ScoreboardProps = {
		player1Name?: string;
		player2Name?: string;
		leftScore: number;
		rightScore: number;
		servingSide: ServingSide;
		savedPlayerNames: string[];
		defaultPlayer1Name: string;
		defaultPlayer2Name: string;
		onDecreaseLeft: () => void;
		onIncreaseLeft: () => void;
		onDecreaseRight: () => void;
		onIncreaseRight: () => void;
		onSwapSides: () => void;
		onSwapServingSide: () => void;
	};

	let {
		player1Name = $bindable(''),
		player2Name = $bindable(''),
		leftScore,
		rightScore,
		servingSide,
		savedPlayerNames,
		defaultPlayer1Name,
		defaultPlayer2Name,
		onDecreaseLeft,
		onIncreaseLeft,
		onDecreaseRight,
		onIncreaseRight,
		onSwapSides,
		onSwapServingSide
	}: ScoreboardProps = $props();
</script>

<div class="relative w-full max-w-md self-center">
	<div class="grid grid-cols-2 gap-8">
		<Tracker
			bind:name={player1Name}
			ariaLabel="Player 1 name"
			decreaseLabel="Decrease tracker 1"
			increaseLabel="Increase tracker 1"
			isServing={servingSide === 'left'}
			nameSuggestionsListId="saved-player-names"
			placeholder={defaultPlayer1Name}
			score={leftScore}
			onDecrease={onDecreaseLeft}
			onIncrease={onIncreaseLeft}
		/>

		<Tracker
			bind:name={player2Name}
			ariaLabel="Player 2 name"
			decreaseLabel="Decrease tracker 2"
			increaseLabel="Increase tracker 2"
			isServing={servingSide === 'right'}
			nameSuggestionsListId="saved-player-names"
			placeholder={defaultPlayer2Name}
			score={rightScore}
			onDecrease={onDecreaseRight}
			onIncrease={onIncreaseRight}
		/>
	</div>

	<DropdownMenu>
		<DropdownMenuTrigger
			class={`${buttonVariants({ variant: 'ghost', size: 'icon-sm' })} absolute top-7 left-1/2 -translate-x-1/2`}
			aria-label="Open swap options"
		>
			<ArrowLeftRight aria-hidden="true" />
		</DropdownMenuTrigger>
		<DropdownMenuContent align="center">
			<DropdownMenuGroup>
				<DropdownMenuItem onclick={onSwapSides}>Swap players</DropdownMenuItem>
				<DropdownMenuItem onclick={onSwapServingSide}>Swap serving side</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</div>

<datalist id="saved-player-names">
	{#each savedPlayerNames as name (name)}
		<option value={name}></option>
	{/each}
</datalist>
