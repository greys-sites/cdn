<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

	import Album from '$lib/components/album.svelte';
	import Card from '$lib/components/card.svelte';

	/** @type {{form: any, data: any}} */
	let { form, data } = $props();

	let albums = $derived.by(() => data?.albums ?? []);
	let images = $derived.by(() => data?.images?.filter(x => !x.album || !albums.find(a => a.hid == x.album)) ?? []);

	$effect(() => {
		if(form?.id == "login" && form?.success) goto('/dash');
	});
</script>

{#if !data?.user}
	<form action="?/login" method="post" use:enhance>
      <label>Token:
      <input type="text" name="token" id="token">
      </label>
      <input value="login" name="submit" type="submit">
    </form>
{:else}
	<h1>Dashboard</h1>

	<div>
		<h2>Upload Images</h2>
		<form action="?/upload" method="POST" enctype="multipart/form-data" use:enhance >
		  <label>Select image(s) to upload:
		  <input name="files" id="files" type="file" multiple>
		  </label>
		  <br>
		  <label>Enter an album ID:
		  <input name="album" id="album" type="text">
		  </label>
		  <br>
		  <input value="UPLOAD" name="submit" type="submit">
		</form>
	</div>

	<div>
		<h2>Create Album</h2>
		<form action="?/create-album" method="POST" enctype="multipart/form-data" use:enhance >
		  <label>Album name:
		  <input name="name" id="name" type="text" placeholder="name">
		  </label>
		  <br>
		  <label>Album hid:
		  <input name="hid" id="hid" type="text" placeholder="hid">
		  </label>
		  <br>
		  <input value="CREATE" name="submit" type="submit">
		</form>
	</div>

	<h2>Albums</h2>
	<div class="album-container">
		{#each albums as alb (alb.hid)}
			<Album {alb} frm={form}/>
		{/each}
	</div>

	<h2>Unsorted Images</h2>
	<div class="image-container">
		{#each images as img (img.hid)}
			<Card {img} frm={form}/>
		{/each}
	</div>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	div {
		text-align: center;
	}

	.album-container, .image-container {
		background: #202020;
		color: #ccc;
		height: 100%;
		width: 90%;
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
		border-radius: 5px;
	}

	form {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	h2 {
		margin: 0;
		padding: 0;
	}
</style>