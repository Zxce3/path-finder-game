<script lang="ts">
  import { onMount } from 'svelte';
  import { app, initializeDOMElements } from '$lib/helper';

  let timer: number = 0;
  let interval: number;

  function startTimer() {
    interval = setInterval(() => {
      timer++;
      document.getElementById("timer")!.textContent = timer.toString();
    }, 1000);
  }

  function resetTimer() {
    clearInterval(interval);
    timer = 0;
    document.getElementById("timer")!.textContent = timer.toString();
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
  <div id="score"></div>
  <div id="timer">0</div>
  <svg id="svg"></svg>
  
  <div id="launch-screen" class="is-visible">
    <div id="launch-screen-content">
      <h1 id="launch-screen__title">s</h1>
      <p id="launch-screen__description"></p>
      <button class="btn" id="start-btn">PLAY</button>
    </div>
  </div>
</div>
