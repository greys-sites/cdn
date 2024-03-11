<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import Card from '$lib/components/card.svelte';

	export let form;
	export let data;

	let album = {};
	let images = [];
	let API = '';

	$: if(!data.user) goto('/dash');
	$: if(data?.album) {
		album = data.album;
		images = data.album.images ?? [];
	}
	$: if(data?.API) API = data.API;
</script>

<h1>Dashboard</h1>
<a class="btn" href="/dash">Go Back</a>

<h2>Upload Images</h2>
<form action="/dash?/upload" method="POST" enctype="multipart/form-data" use:enhance >
  <input name="album" id="album" type="hidden" value={album.hid}>
  <label>Select image(s) to upload:
  <input name="files" id="files" type="file" multiple>
  </label>
  <br>
  <input value="UPLOAD" name="submit" type="submit">
</form>

<h2>Album Info</h2>
<div class="album-container">
	<p><b>Name:</b> {album.name}</p>
	<p><b>Hid:</b> {album.hid}</p>
	<p><b>Description:</b><br/>{album.description}</p>
</div>

<h2>Images</h2>
<div class="image-container">
	{#each images as img (img.hid)}
		<Card {img} {API} />
	{/each}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.album-container {
		background: #202020;
		color: #ccc;
		height: 100%;
		width: 90%;
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 5px;
	}

	.image-container {
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

	.btn {
		margin: 0;
		padding: 10px;
		background-color: teal;
		text-decoration: none;
		border: 0px solid transparent;
		border-radius: 5px;
		color: white;
		font-weight: bold;
	}

	h2 {
		margin: 0;
		padding: 0;
	}
</style>