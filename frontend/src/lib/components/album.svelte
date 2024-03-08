<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	
	export let alb;
	export let API;

	$: if($page.form) {
		console.log($page.form);
		if(
			$page.form.success &&
			$page.form.id == 'editalb' &&
			$page.form.data?.hid == alb.hid
		) {
			editing = false;
			alb = $page.form.data;
		}
	}

	let editing = false;

	function toggle() {
		editing = !editing;
	}
</script>

{#if editing}
	<form class='card-edit' method="post" action="/dash?/editalb" use:enhance>
		<input type="hidden" name="oldhid" id="oldhid" value={alb.hid}>
		<div class='wrapper' style="background-image: url('{alb.cover_url}')">
		</div>
		<div class='info'>
			<input type="text" value={alb.hid} id="newhid" name="newhid" placeholder="hid">
			<input type="text" value={alb.name} id="name" name="name" placeholder="name">
			<input type="text" value={alb.cover_url} id="cover_url" name="cover_url" placeholder="cover url">
			<textarea rows=10 id="description" name="description" placeholder="description"></textarea>
			<div class='btns'>
				<input class="btn" type="submit" value="SAVE" />
				<div class="btn" on:click={toggle}>CANCEL</div>
			</div>
		</div>
	</form>
{:else}
	<form class='card' method="post" action="/dash?/delalb" use:enhance>
		<input type="hidden" name="hid" id="hid" value={alb.hid}>
		<div class='wrapper' style="background-image: url('{alb.cover_url ?? '/default.png'}')">
		</div>
		<div class='info'>
			<h2>{alb.name}</h2>
			<div class='btns'>
				<a href={`/dash/album/${alb.hid}`}>View</a>
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