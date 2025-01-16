<script lang="ts">
  import { onMount } from 'svelte';
  import { app, initializeDOMElements } from '$lib/helper';

  onMount(() => {
    initializeDOMElements();
    app.launchScreen(
      0,
      "Path finder",
      "Find the nearest yellow dot.",
      "PLAY"
    );
  });
</script>

<div id="app">
  <div id="score"></div>
  <svg id="svg"></svg>
  
  <div id="launch-screen" class="is-visible">
    <div id="launch-screen-content">
      <h1 id="launch-screen__title">s</h1>
      <p id="launch-screen__description"></p>
      <button class="btn" id="start-btn">PLAY</button>
    </div>
  </div>
</div>
