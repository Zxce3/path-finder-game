<script lang="ts">
	import { base } from '$app/paths';
	const currentYear = new Date().getFullYear();
	const source = 'https://github.com/Zxce3/path-finder-game';
</script>

<svelte:head>
	<title>About Path Finder</title>
</svelte:head>

<main class="about">
	<nav>
		<a class="about__back" href={`${base}/`}>&larr; Back to game</a>
	</nav>

	<header>
		<svg class="about__path" viewBox="0 0 200 60" aria-hidden="true">
			<path d="M16 44 L66 18 L118 40 L184 14" />
			<circle class="done" cx="16" cy="44" r="7" />
			<circle class="done" cx="66" cy="18" r="7" />
			<circle class="here" cx="118" cy="40" r="9" />
			<circle class="next" cx="184" cy="14" r="8" />
		</svg>
		<h1>Path Finder</h1>
		<p>A quick game of judging distance against the clock.</p>
	</header>

	<section class="card">
		<h2>How to play</h2>
		<ol>
			<li>Start at the green dot.</li>
			<li>Tap the yellow dot nearest to where you are.</li>
			<li>Visit every dot before time runs out. One wrong tap ends the run.</li>
		</ol>
	</section>

	<section class="card">
		<h2>Rules and controls</h2>
		<dl>
			<dt>Levels</dt>
			<dd>Each adds 3 dots (up to 50) and 5 seconds.</dd>
			<dt>Close calls</dt>
			<dd>Distances within 3px of each other both count.</dd>
			<dt>Pause</dt>
			<dd>Use the Pause button, <kbd>P</kbd> or <kbd>Esc</kbd>.</dd>
			<dt>Keyboard</dt>
			<dd><kbd>Tab</kbd> to a dot, then <kbd>Enter</kbd>.</dd>
		</dl>
	</section>

	<section class="card">
		<h2>Credits</h2>
		<p>
			Developed by <a href="https://github.com/zxce3" target="_blank" rel="noopener noreferrer"
				>zxce3</a
			>. Inspired by, and using code from,
			<a href="https://codepen.io/blazicke/pen/MEvZRR" target="_blank" rel="noopener noreferrer"
				>this CodePen</a
			>
			by
			<a href="https://codepen.io/blazicke" target="_blank" rel="noopener noreferrer">Blazicke</a>.
		</p>
		<p>
			<a href={source} target="_blank" rel="noopener noreferrer">Source code on GitHub</a>. Hosted
			on
			<a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify</a>.
		</p>
	</section>

	<a class="btn" href={`${base}/`}>Play now</a>

	<footer>&copy; {currentYear} Path Finder. All rights reserved.</footer>
</main>
