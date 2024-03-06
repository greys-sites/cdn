<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	export let form;
	export let data;

	let images = [];
	let API = '';

	$: if(form?.id == "login" && form?.success) goto('/dash');
	$: if(data?.images) images = data.images;
	$: if(images?.length) console.log(images);
	$: if(data?.API) API = data.API;
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

	<div class="upload-form">
		<form action="?/upload" method="POST" enctype="multipart/form-data" use:enhance >
		  <label>Select image(s) to upload:
		  <input name="files" id="files" type="file" multiple>
		  </label>
		  <br>
		  <input value="UPLOAD" name="submit" type="submit">
		</form>
	</div>

	<div class="image-container">
		{#each images as img (img.hid)}
			<form class='card' method="post" action="?/delimg" use:enhance>
				<input type="hidden" name="hid" id="hid" value={img.hid}>
				<div class='wrapper' style="background-image: url('{API}/{img.hid}.{img.mime}')">
					<div class='info'>
						<h2>{img.name}</h2>
						<div class='btns'>
							<a href={`${API}/${img.hid}.${img.mime}`}>View</a>
							<a href={`/edit/${img.hid}`}>Edit</a>
							<input class="btn" type="submit" value="Delete" />
						</div>
					</div>
				</div>
			</form>
		{/each}
	</div>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	html, body {
		background: #202020;
		color: #ccc;
		height: 100%;
		width: 100%;
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.card {
		width: 300px;
		height: 300px;
		margin: 10px;
		padding: 0;
		display: inline-block;
		position: relative;
		border-radius: 5px;
		flex: 1 0;
	}

	.card .wrapper {
		width: 300px;
		height: 300px;
		padding: 0;
		margin: 0;
		object-fit: cover;
		object-position: center;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: inline-block;
		top: 0;
		left: 0;
		border-radius: 5px;
	}



	.card .info {
		width: 300px;
		height: 100px;
		flex: 1 0;
		margin: 0;
		padding: 0;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		background-color: #111;
		display: flex;
		flex-direction: column;
		align-items: space-around;
		justify-content: center;
		position: absolute;
		bottom: 0;
	}

	.card .btns {
		width: 300px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.btns a, .btn {
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