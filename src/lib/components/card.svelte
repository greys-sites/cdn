<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import {
		Button,
		Input,
		Label,
		Textarea
	} from 'flowbite-svelte';

	import Image from '~icons/ic/round-image-not-supported';
	
	/** @type {{itm: any}} */
	let { itm = $bindable(), toggleEdit, type } = $props();

	let url = $derived(
		type == 'album' ?
		`/dash/album/${itm.hid}` :
		`/img/${itm.hid}.${itm.mime}`
	)

	let formid = $derived(
		type == 'album' ?
		`editalb` :
		`editimg`
	)

	let action = $derived(
		type == 'album' ?
		`/dash?/delalb` :
		`/dash?/delimg`
	)

	let bgurl = $derived(
		type == 'album' ?
		itm.cover_url :
		`/img/${itm.hid}.${itm.mime}`
	)

	$effect(() => {
		if($page.form) {
			if(
				$page.form.success &&
				$page.form.id == formid &&
				$page.form.data?.hid == itm.hid
			) {
				itm = $page.form.data;
			}
		}
	});

	let deleting = $state(false);

	function setDelete(e) {
		e?.preventDefault();
		deleting = true;
	}

	function cancelDelete(e) {
		e?.preventDefault();
		deleting = false;
	}

	const toggle = (e) => {
		e.preventDefault();
		toggleEdit(itm)
	}
</script>

<form class='card bg-gray-300 dark:bg-gray-700'
	method="post" {action} use:enhance
>
	<input type="hidden" name="hid" id="hid" value={itm.hid}>
	{#if bgurl}
		<div class='wrapper' style="background-image: url('{bgurl}')">
		</div>
	{:else}
		<div class='wrapper flex justify-center items-center text-9xl'>
			<Image />
		</div>
	{/if}
	<div class='info'>
		<h2>{itm.name}</h2>
		<div class='btns'>
			{#if !deleting}
				<Button href={url}>View</Button>
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
.card {
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

.card .wrapper {
	width: 300px;
	height: 300px;
	padding: 0;
	margin: 5px;
	object-fit: cover;
	object-position: center;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
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

.card .btns {
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