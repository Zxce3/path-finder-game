<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { levelConfig, nearest, placeDots, type Point } from '$lib/game';
	import { playSound } from '$lib/sound';
	import { load, save } from '$lib/storage';

	type Phase = 'ready' | 'playing' | 'paused' | 'won' | 'lost';

	let phase = $state<Phase>('ready');
	let level = $state(1);
	let score = $state(0);
	let best = $state(0);
	let muted = $state(false);
	let newBest = $state(false);
	let lossReason = $state('');

	let points = $state.raw<Point[]>([]);
	let path = $state.raw<number[]>([]);
	let answers = $state.raw<number[]>([]);
	let wrong = $state(-1);
	let hitRadius = $state(22);
	let pointer = $state.raw<Point | null>(null);

	let board = $state.raw({ width: 1, height: 1 });
	let areaWidth = $state(0);
	let areaHeight = $state(0);

	let msLeft = $state(levelConfig(1).seconds * 1000);
	let deadline = 0;

	let svg: SVGSVGElement;
	let area: HTMLElement;
	let primaryButton = $state<HTMLButtonElement>();

	const config = $derived(levelConfig(level));
	const current = $derived(path.at(-1) ?? 0);
	const visited = $derived(new Set(path));
	const secondsLeft = $derived(Math.ceil(msLeft / 1000));
	// Swapping x and y after a device rotation keeps every distance (and so the answer) the same.
	const rotated = $derived(areaWidth > 0 && areaWidth > areaHeight !== board.width > board.height);
	const view = $derived(rotated ? { width: board.height, height: board.width } : board);
	const shown = $derived(rotated ? points.map((p) => ({ x: p.y, y: p.x })) : points);

	// The result panel sits on the opposite side of the dot it must not cover.
	const answer = $derived(shown[answers[0]]);

	function sound(name: Parameters<typeof playSound>[0]) {
		if (!muted) playSound(name);
	}

	function toggleMute() {
		muted = !muted;
		save('path-finder:muted', String(muted));
	}

	function startLevel() {
		if (phase === 'lost') {
			level = 1;
			score = 0;
		} else if (phase === 'won') {
			level += 1;
		}

		board = { width: area.clientWidth, height: area.clientHeight };
		const placed = placeDots(levelConfig(level).dots, board.width, board.height);
		points = placed.points;
		hitRadius = Math.min(24, placed.spacing / 2);
		path = [0];
		answers = [];
		wrong = -1;
		pointer = null;
		newBest = false;
		msLeft = levelConfig(level).seconds * 1000;
		deadline = performance.now() + msLeft;
		phase = 'playing';
		sound('play');
	}

	async function showOverlay(next: Phase) {
		phase = next;
		await tick();
		primaryButton?.focus();
	}

	function lose(reason: string, clicked = -1) {
		answers = nearest(points, current, visited);
		wrong = clicked;
		lossReason = reason;
		sound('gameover');
		showOverlay('lost');
	}

	function pick(index: number) {
		if (phase !== 'playing' || visited.has(index)) return;
		if (performance.now() >= deadline) {
			msLeft = 0;
			return lose('Time ran out.');
		}
		if (!nearest(points, current, visited).includes(index)) {
			return lose('That was not the nearest dot.', index);
		}

		path = [...path, index];
		score += 1;
		if (score > best) {
			best = score;
			newBest = true;
			save('path-finder:best', String(best));
		}

		if (path.length === points.length) {
			sound('nextlevel');
			showOverlay('won');
		} else {
			sound('click');
		}
	}

	function pause() {
		if (phase !== 'playing') return;
		msLeft = Math.max(deadline - performance.now(), 0);
		showOverlay('paused');
	}

	function resume() {
		deadline = performance.now() + msLeft;
		phase = 'playing';
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' && event.key.toLowerCase() !== 'p') return;
		if (phase === 'playing') pause();
		else if (phase === 'paused') resume();
	}

	function onDotKeydown(event: KeyboardEvent, index: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		pick(index);
	}

	function trackPointer(event: PointerEvent) {
		const matrix = svg.getScreenCTM();
		if (event.pointerType !== 'mouse' || !matrix) return;
		const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
		pointer = { x: point.x, y: point.y };
	}

	$effect(() => {
		if (phase !== 'playing') return;
		const interval = setInterval(() => {
			msLeft = Math.max(deadline - performance.now(), 0);
			if (msLeft === 0) lose('Time ran out.');
		}, 100);
		return () => clearInterval(interval);
	});

	onMount(() => {
		best = Number(load('path-finder:best')) || 0;
		muted = load('path-finder:muted') === 'true';
	});
</script>

<svelte:head>
	<title>Path Finder - Score: {score}</title>
</svelte:head>

<svelte:window onkeydown={onKeydown} />
<svelte:document onvisibilitychange={() => document.hidden && pause()} />

<main class="game">
	<header class="hud">
		<dl class="stats">
			<div class="stat">
				<dt>Level</dt>
				<dd>{level}</dd>
			</div>
			<div class="stat stat--score">
				<dt>Score</dt>
				<dd>{score}</dd>
			</div>
			<div class="stat stat--time" class:is-urgent={phase === 'playing' && secondsLeft <= 5}>
				<dt>Time</dt>
				<dd>{secondsLeft}s</dd>
			</div>
			<div class="stat stat--best">
				<dt>Best</dt>
				<dd>{best}</dd>
			</div>
		</dl>
		<div class="controls">
			<button class="icon-btn" onclick={toggleMute} aria-pressed={muted}>
				{muted ? 'Sound off' : 'Sound on'}
			</button>
			<button class="icon-btn" onclick={pause} disabled={phase !== 'playing'}>Pause</button>
		</div>
		<div class="time-bar" aria-hidden="true">
			<div style:transform="scaleX({msLeft / (config.seconds * 1000)})"></div>
		</div>
	</header>

	<div class="board" bind:this={area} bind:clientWidth={areaWidth} bind:clientHeight={areaHeight}>
		<svg
			bind:this={svg}
			viewBox="0 0 {view.width} {view.height}"
			class:is-hidden={phase === 'paused'}
			role="group"
			aria-label="Game board"
			onpointermove={trackPointer}
			onpointerleave={() => (pointer = null)}
		>
			{#each path.slice(1) as to, i}
				<line
					class="line"
					x1={shown[path[i]].x}
					y1={shown[path[i]].y}
					x2={shown[to].x}
					y2={shown[to].y}
				/>
			{/each}
			{#if phase === 'playing' && pointer}
				<line
					class="line line--guide"
					x1={shown[current].x}
					y1={shown[current].y}
					x2={pointer.x}
					y2={pointer.y}
				/>
			{/if}
			{#each shown as dot, i (i)}
				<g
					class="dot"
					class:is-visited={visited.has(i)}
					class:is-current={i === current}
					class:is-answer={answers.includes(i)}
					class:is-wrong={i === wrong}
					role="button"
					tabindex={phase === 'playing' && !visited.has(i) ? 0 : -1}
					aria-label="Dot {i + 1}{i === current ? ', you are here' : ''}{visited.has(i)
						? ', visited'
						: ''}"
					transform="translate({dot.x} {dot.y})"
					onclick={() => pick(i)}
					onkeydown={(event) => onDotKeydown(event, i)}
				>
					<circle class="dot__hit" r={hitRadius} />
					<circle class="dot__mark" r="8" />
				</g>
			{/each}
		</svg>
	</div>

	{#if phase !== 'playing'}
		<div
			class="overlay"
			class:overlay--result={phase === 'lost'}
			class:overlay--top={phase === 'lost' && answer && answer.y > view.height / 2}
			class:overlay--left={phase === 'lost' && answer && answer.x > view.width / 2}
		>
			<section class="panel" aria-live="polite">
				{#if phase === 'ready'}
					<h1>Path Finder</h1>
					<p>
						Start at the green dot and always tap the nearest yellow dot. Clear them all before time
						runs out.
					</p>
					<p>{config.dots} dots, {config.seconds} seconds.</p>
					<button class="btn" bind:this={primaryButton} onclick={startLevel}>Play</button>
				{:else if phase === 'paused'}
					<h1>Paused</h1>
					<p>{secondsLeft} seconds left. The board is hidden until you resume.</p>
					<button class="btn" bind:this={primaryButton} onclick={resume}>Resume</button>
				{:else if phase === 'won'}
					<h1>Well done!</h1>
					<p>Level {level} cleared. Score: {score}.</p>
					<p>
						Next: {levelConfig(level + 1).dots} dots, {levelConfig(level + 1).seconds} seconds.
					</p>
					<button class="btn" bind:this={primaryButton} onclick={startLevel}>Next level</button>
				{:else}
					<h1>Game over!</h1>
					<p>{lossReason} The nearest dot is ringed on the board.</p>
					<p>Final score: {score}.{newBest ? ' New best!' : ''}</p>
					<button class="btn" bind:this={primaryButton} onclick={startLevel}>Play again</button>
				{/if}
				<a class="link" href="/about">About</a>
			</section>
		</div>
	{/if}
</main>
