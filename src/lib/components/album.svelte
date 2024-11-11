<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import {
		Button,
		Input,
		Label,
		Textarea
	} from 'flowbite-svelte';

	/** @type {{alb: any, toggleEdit: any}} */
	let { alb = $bindable(), toggleEdit } = $props();

	$effect(() => {
		if($page.form) {
			if(
				$page.form.success &&
				$page.form.id == 'editalb' &&
				$page.form.data?.hid == alb.hid
			) {
				editing = false;
				alb = $page.form.data;
			}
		}
	});

	let editing = $state(false);
	let deleting = $state(false);

	function toggle(e) {
		e?.preventDefault();
		toggleEdit(alb)
	}

	function setDelete(e) {
		e?.preventDefault();
		deleting = true;
	}

	function cancelDelete(e) {
		e?.preventDefault();
		deleting = false;
	}
</script>

<form class='card bg-gray-300 dark:bg-gray-700 font-bold text-xl'
	method="post" action="/dash?/delalb"
	use:enhance
>
	<Input type="hidden" name="hid" id="hid" value={alb.hid} />
	<div class='background' style="background-image: url('{alb.cover_url}')">
	</div>
	<div class='info'>
		<h2>{alb.name}</h2>
		<div class='btns'>
			{#if !deleting}
				<Button href={`/dash/album/${alb.hid}`}>View</Button>
				<Button onclick={(e) => toggle(e)}>Edit</Button>
				<Button onclick={(e) => setDelete(e)}>Delete</Button>
			{:else}
				<Button type="submit">Confirm</Button>
				<Button onclick={(e) => cancelDelete(e)}>Cancel</Button>
			{/if}
		</div>
	</div>
</form>

<style>
.card, .card-edit {
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

.card .background {
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

h2 {
	margin: 5px 0;
	padding: 0;
}
</style>