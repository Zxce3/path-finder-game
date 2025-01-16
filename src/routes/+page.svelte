<script lang="ts">
  import { onMount } from 'svelte';
  import { app, initializeDOMElements } from '$lib/helper';
  import { timer, highScore, score } from '$lib/stores';

  let interval: number;

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
