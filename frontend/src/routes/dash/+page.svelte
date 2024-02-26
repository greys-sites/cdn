<script>
	import { enhance } from '$app/forms';

	export let form;
	export let data;
</script>

{#if data.user}
	<h1>Dashboard</h1>
	<p><a href="/dash/upload">Upload something</a></p>
	<p><a href="/dash/images">View images</a></p>
{:else}
	<form action="?/login" method="post" use:enhance>
      <label>Token:
      <input type="text" name="token" id="token">
      </label>
      <input value="login" name="submit" type="submit">
    </form>
{/if}