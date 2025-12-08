<script lang="ts">
  import { pixiApp } from '../core/App.ts';

  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    pixiApp.init(canvas);
  });
</script>

<main id="game-wrapper">
  <canvas id="game-canvas" bind:this={canvas}></canvas>
</main>
