<script lang="ts">
	import { getRandomWord } from './words';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import confetti from 'canvas-confetti';

	// Config
	const MAX_LIVES = 6;
	let lives = MAX_LIVES;
	let secretWord = getRandomWord('Makanan');
	let guesses: string[] = [];
	let currentGuess = '';
	let status: 'playing' | 'won' | 'lost' = 'playing';

	// Derived states
	$: revealedLetters = secretWord.split('').map((l) => (guesses.includes(l) ? l : null));

	$: remainingLetters = secretWord.split('').filter((l) => !guesses.includes(l));
	$: isWin = remainingLetters.length === 0;
	$: isLose = lives <= 0;

	// Game logic
	function submitGuess() {
		if (!currentGuess || status !== 'playing') return;

		const letter = currentGuess.toUpperCase();
		currentGuess = '';

		if (guesses.includes(letter)) return;

		guesses = [...guesses, letter];

		if (!secretWord.includes(letter)) {
			lives--;
		}

		const remaining = secretWord.split('').filter((l) => !guesses.includes(l));
		if (remaining.length === 0) {
			status = 'won';
			// 🎉 Trigger confetti kalau mau
			confetti({
				particleCount: 100,
				angle: 60,
				spread: 70,
				startVelocity: 30,
				gravity: 0.5,
				origin: { x: 0.5, y: 0.5 },
				colors: ['#ff0000', '#00ff00', '#0000ff']
			});
		} else if (lives <= 0) {
			status = 'lost';
		}
	}

	function resetGame() {
		secretWord = getRandomWord('Teknologi');
		guesses = [];
		lives = MAX_LIVES;
		status = 'playing';
	}

	// Dynamic background based on lives
	$: bgGradient = {
		'6': 'from-emerald-50 to-blue-50',
		'5': 'from-amber-50 to-blue-50',
		'4': 'from-amber-100 to-orange-100',
		'3': 'from-orange-100 to-red-100',
		'2': 'from-red-100 to-pink-100',
		'1': 'from-red-200 to-rose-200',
		'0': 'from-gray-200 to-gray-300'
	}[lives];
</script>

<!-- Main Wrapper -->
<div
	class={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000 dark:from-gray-900 dark:to-gray-800`}
>
	<!-- Glass Panel -->
	<div class="container mx-auto flex flex-col items-center px-4 py-6 sm:py-12">
		<div
			class="w-full max-w-lg overflow-hidden rounded-3xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-lg transition-all hover:shadow-2xl sm:max-w-2xl dark:border-gray-700/50 dark:bg-gray-800/80"
		>
			<!-- Header -->
			<div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center sm:p-6">
				<h1 class="text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-4xl">
					HANGMAN <span class="text-yellow-300">ULTRA</span>
				</h1>
				<p class="mt-1 text-sm font-medium text-blue-100 sm:text-base">
					{#if status === 'playing'}
						Tebak huruf satu per satu!
					{:else if status === 'won'}
						🏆 Kemenangan epik!
					{:else}
						💀 Coba lagi!
					{/if}
				</p>
			</div>

			<!-- Game Area -->
			<div class="p-8">
				<!-- Hangman Visual -->
				<div class="relative mb-8 flex h-48 justify-center">
					<svg width="200" height="180" viewBox="0 0 200 180" class="transition-all duration-500">
						<!-- Base Gallows -->
						<path
							d="M20 170 L180 170"
							stroke="currentColor"
							stroke-width="4"
							class="text-gray-400"
						/>
						<path d="M60 170 L60 20" stroke="currentColor" stroke-width="4" class="text-gray-400" />
						<path d="M60 20 L120 20" stroke="currentColor" stroke-width="4" class="text-gray-400" />
						<path
							d="M120 20 L120 40"
							stroke="currentColor"
							stroke-width="4"
							class="text-gray-400"
						/>

						<!-- Dynamic Parts (appears when lives decrease) -->
						{#if lives < 6}<circle
								cx="120"
								cy="55"
								r="15"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Head -->
						{#if lives < 5}<path
								d="M120 70 L120 110"
								stroke="currentColor"
								stroke-width="3"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Body -->
						{#if lives < 4}<path
								d="M120 80 L100 60"
								stroke="currentColor"
								stroke-width="2"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Left Arm -->
						{#if lives < 3}<path
								d="M120 80 L140 60"
								stroke="currentColor"
								stroke-width="2"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Right Arm -->
						{#if lives < 2}<path
								d="M120 110 L100 140"
								stroke="currentColor"
								stroke-width="2"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Left Leg -->
						{#if lives < 1}<path
								d="M120 110 L140 140"
								stroke="currentColor"
								stroke-width="2"
								class="text-gray-800 dark:text-white"
							/>{/if}
						<!-- Right Leg -->
					</svg>

					<!-- Lives Counter -->
					<div
						class="absolute top-0 right-0 flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
					>
						<span class="mr-1 animate-pulse">❤️</span>
						{lives}/{MAX_LIVES}
					</div>
				</div>

				<!-- Word Display -->
				<div class="mb-8 flex justify-center gap-2 sm:mb-10 sm:gap-3">
					{#each secretWord.split('') as letter, i}
						<div
							class={`flex h-12 w-10 items-center justify-center border-b-4 text-2xl font-bold sm:h-16 sm:w-12 sm:text-3xl ${guesses.includes(letter) ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-gray-200 text-transparent dark:border-gray-600'} transition-all duration-300`}
							in:fly={{ y: -20, delay: i * 50 }}
						>
							{guesses.includes(letter) ? letter : '?'}
						</div>
					{/each}
				</div>

				<!-- Input Area -->
				{#if status === 'playing'}
					<div class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row">
						<input
							type="text"
							bind:value={currentGuess}
							maxlength="1"
							on:keydown={(e) => e.key === 'Enter' && submitGuess()}
							class="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-center text-lg font-medium transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none sm:px-5 sm:py-3 sm:text-xl dark:border-gray-600 dark:bg-gray-700"
							placeholder="A-Z"
						/>
						<button
							on:click={submitGuess}
							class="transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-600 sm:px-6 sm:py-3"
						>
							TEBAK
						</button>
					</div>
				{/if}

				<!-- Game Status -->
				{#if status !== 'playing'}
					<div
						class={`mb-4 rounded-lg p-4 text-center text-base font-bold sm:mb-6 sm:p-5 sm:text-lg ${status === 'won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
						in:scale={{ duration: 500 }}
					>
						{#if status === 'won'}
							🎉 KAMU MENANG! Kata: {secretWord}
						{:else}
							☠️ KAMU KALAH! Kata: {secretWord}
						{/if}
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						on:click={resetGame}
						class="flex-1 rounded-lg bg-gray-200 py-2 font-medium transition-colors hover:bg-gray-300 sm:py-3 dark:bg-gray-700 dark:hover:bg-gray-600"
					>
						{status === 'playing' ? 'ULANGI' : 'MAIN LAGI'}
					</button>
					{#if status !== 'playing'}
						<button
							class="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2 font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600 sm:py-3"
						>
							LEVEL BERIKUTNYA
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
			© {new Date().getFullYear()} Hangman Hub Premium
		</p>
	</div>
</div>
