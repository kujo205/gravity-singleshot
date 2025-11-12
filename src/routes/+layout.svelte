<script lang="ts">
  import '../global.css';
  import favicon from '$lib/assets/favicon.svg';
  import { pixiApp } from '../game/App.ts';

  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    pixiApp.init(canvas);
  });

  const { children } = $props();
</script>

<svelte:head>
  <title>Gravity Singleshot</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<main id="game-wrapper">
  <canvas id="game-canvas" bind:this={canvas}></canvas>
  {@render children()}
</main>
