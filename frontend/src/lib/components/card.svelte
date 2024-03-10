<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	
	export let img;
	export let API;

	$: if($page.form) {
		console.log($page.form);
		if(
			$page.form.success &&
			$page.form.id == 'editimg' &&
			$page.form.data?.hid == img.hid
		) {
			editing = false;
			img = $page.form.data;
		}
	}

	let editing = false;

	function toggle() {
		editing = !editing;
	}
</script>

{#if editing}
	<form class='card-edit' method="post" action="/dash?/editimg" use:enhance>
		<input type="hidden" value={img.hid} name="oldhid" id="oldhid">
		<div class='wrapper' style="background-image: url('/img/{img.hid}.{img.mime}')">
		</div>
		<div class='info'>
			<input type="text" value={img.hid} id="hid" name="hid" placeholder="hid">
			<input type="text" value={img.name} id="name" name="name" placeholder="name">
			<input type="text" value={img.album} id="album" name="album" placeholder="album hid">
			<textarea rows=10 id="description" name="description" placeholder="description"></textarea>
			<div class='btns'>
				<input class="btn" type="submit" value="SAVE" />
				<div class="btn" on:click={toggle}>CANCEL</div>
			</div>
		</div>
	</form>
{:else}
	<form class='card' method="post" action="/dash?/delimg" use:enhance>
		<input type="hidden" name="hid" id="hid" value={img.hid}>
		<div class='wrapper' style="background-image: url('/img/{img.hid}.{img.mime}')">
		</div>
		<div class='info'>
			<h2>{img.name}</h2>
			<div class='btns'>
				<a href={`/img/${img.hid}.${img.mime}`}>View</a>
				<div class="btn" on:click={toggle}>Edit</div>
				<input class="btn" type="submit" value="Delete" />
			</div>
		</div>
	</form>
{/if}

<style>
.card, .card-edit {
	background-color: #111;
	max-width: 310px;
	/*height: 300px;*/
	margin: 10px;
	padding: 0;
	/*display: inline-block;*/
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/*position: relative;*/
	border-radius: 5px;
	flex: 1 0;
}

.card-edit {
	height: auto;
}

.card .wrapper, .card-edit .wrapper {
	width: 300px;
	height: 300px;
	padding: 0;
	margin: 5px;
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
	margin: 5px 0;
	padding: 0;
	display: flex;
	text-align: center;
	flex-direction: column;
	align-items: space-around;
	justify-content: center;
	/*position: absolute;
	bottom: 0;*/
}

.card-edit .info {
	width: 300px;
	height: auto;
	flex: 1 0;
	margin: 5px 0;
	padding: 0;
	display: flex;
	text-align: center;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/*position: absolute;
	bottom: 0;*/
}

.card .btns, .card-edit .btns {
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
	margin: 5px 0;
	padding: 0;
}
</style>