<script lang="ts">
  import { onMount } from 'svelte';
  import { app, initializeDOMElements } from '$lib/helper';
  import { timer, highScore, score } from '$lib/stores';
  import { derived } from 'svelte/store';

  let interval: number;

  const pageTitle = derived(score, $score => `Path Finder - Score: ${$score}`);

  function startTimer() {
    interval = setInterval(() => {
      timer.update(n => n + 1);
    }, 1000);
  }

  function resetTimer() {
    clearInterval(interval);
    timer.set(0);
  }

  onMount(() => {
    initializeDOMElements();
    app.launchScreen(
      0,
      "Path finder",
      "Find the nearest yellow dot.",
      "PLAY"
    );
    app.startTimer = startTimer;
    app.resetTimer = resetTimer;
  });
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewport=%220 0 32 32%22 style=%22fill:rgba(241, 196, 15,1.0);%22><circle cx=%2216%22 cy=%2216%22 r=%228%22/></svg>">
</svelte:head>

<div id="app">
  <div id="score">{$score}</div>
  <div id="timer">{$timer}</div>
  <div id="high-score">High Score: {$highScore}</div>
  <svg id="svg"></svg>
  
  <div id="launch-screen" class="is-visible">
    <div id="launch-screen-content">
      <h1 id="launch-screen__title">s</h1>
      <p id="launch-screen__description"></p>
      <button class="btn" id="start-btn">PLAY</button>
    </div>
  </div>
</div>
