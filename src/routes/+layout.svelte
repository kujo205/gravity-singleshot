<script lang="ts">
  import '../global.css';
  import favicon from '$lib/assets/favicon.svg';

  const { children } = $props();
</script>

<svelte:head>
  <title>Gravity Singleshot</title>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
