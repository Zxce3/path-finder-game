<script lang="ts">
	import { onMount } from 'svelte';
	import { app, initializeDOMElements } from '$lib/helper';
	import { timer, highScore, score, timeLimit } from '$lib/stores';
	import { derived } from 'svelte/store';
	import clickSound from '$lib/sounds/click.mp3';
	import playSound from '$lib/sounds/play.mp3';
	import gameOverSound from '$lib/sounds/gameover.mp3';
	import nextLevelSound from '$lib/sounds/nextlevel.mp3';
	import { goto } from '$app/navigation';

	let interval: number;

	const pageTitle = derived(score, ($score) => `Path Finder - Score: ${$score}`);

	function startTimer() {
		interval = setInterval(() => {
			timer.update((n) => {
				let limit = 0;
				timeLimit.subscribe(value => limit = value)();
				if (n >= limit) {
					resetTimer();
					app.end(false);
					return limit;
				}
				return n + 1;
			});
		}, 1000);
	}

	function resetTimer() {
		clearInterval(interval);
		timer.set(0);
	}

	function playSoundEffect(sound: string) {
		const audio = new Audio(sound);
		audio.play();
	}

	function handleAboutButtonClick() {
		goto('/about');
	}

	onMount(() => {
		initializeDOMElements();
		app.launchScreen(0, 'Path finder', 'Find the nearest yellow dot.', 'PLAY');
		app.startTimer = startTimer;
		app.resetTimer = resetTimer;

		const startBtn = document.getElementById('start-btn');
		if (startBtn) {
			startBtn.addEventListener('click', () => playSoundEffect(playSound));
		}

		const aboutBtn = document.getElementById('about-btn');
		if (aboutBtn) {
			aboutBtn.addEventListener('click', handleAboutButtonClick);
		}
	});
</script>

<svelte:head>
	<title>{$pageTitle}</title>
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewport=%220 0 32 32%22 style=%22fill:rgba(241, 196, 15,1.0);%22><circle cx=%2216%22 cy=%2216%22 r=%228%22/></svg>"
	/>
</svelte:head>

<div id="app" class="game-container">
	<div class="game-stats">
		<div id="score">{$score}</div>
		<div id="timer">{$timer}/{$timeLimit}s</div>
		<div id="high-score">High Score: {$highScore}</div>
	</div>
	<svg id="svg"></svg>

	<div id="launch-screen" class="is-visible">
		<div id="launch-screen-content">
			<h1 id="launch-screen__title">s</h1>
			<p id="launch-screen__description"></p>
			<button class="btn" id="start-btn" style="margin-bottom: 1em;">PLAY</button>
			<button class="btn" id="about-btn">ABOUT</button>
		</div>
	</div>
</div>
