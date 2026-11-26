<script lang="ts">
	// You can add any necessary imports here
	let currentYear: number = new Date().getFullYear();
</script>

<svelte:head>
	<title>About Path Finder</title>
</svelte:head>

<main class="about">
	<a href="/">&larr; Back to game</a>
	<h1>About Path Finder</h1>
	<p>
		Path Finder is a fun and challenging game where you need to keep tapping the nearest yellow dot
		before time runs out. The game gets progressively harder with each level, testing your speed and
		accuracy.
	</p>
	<p>
		Developed by a passionate team of game enthusiasts, Path Finder aims to provide an engaging and
		enjoyable experience for players of all ages.
	</p>
	<p>We hope you enjoy playing Path Finder as much as we enjoyed creating it!</p>
	<p>
		Credits: This project was inspired by and uses code from <a
			href="https://codepen.io/blazicke/pen/MEvZRR"
			target="_blank"
			rel="noopener noreferrer">this CodePen</a
		>
		by <a href="https://codepen.io/blazicke" target="_blank" rel="noopener noreferrer">Blazicke</a>.
	</p>
	<p>
		Developed by <a href="https://github.com/zxce3" target="_blank" rel="noopener noreferrer"
			>zxce3</a
		>.
	</p>
	<p>
		The source code for this project can be accessed at <a
			href="https://github.com/Zxce3/path-finder-game/"
			target="_blank"
			rel="noopener noreferrer">https://github.com/Zxce3/path-finder-game/</a
		>.
	</p>
	<p>
		Proudly hosted on <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer"
			>Netlify</a
		>.
	</p>
	<p>&copy; {currentYear} Path Finder. All rights reserved.</p>
</main>
