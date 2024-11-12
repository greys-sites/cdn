<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import {
		Button,
		Input,
		Label,
		Textarea
	} from 'flowbite-svelte';

	import Edit from '~icons/ic/round-edit';
	import Delete from '~icons/ic/round-delete';
	import Check from '~icons/ic/baseline-check-circle';
	import Cancel from '~icons/ic/baseline-cancel';
	import Image from '~icons/ic/round-image-not-supported';

	/** @type {{itm: any}} */
	let { itm = $bindable(), toggleEdit, type } = $props();

	let url = (
		type == 'album' ?
		`/dash/album/${itm.hid}` :
		`/img/${itm.hid}.${itm.mime}`
	)

	let formid = (
		type == 'album' ?
		`editalb` :
		`editimg`
	)

	let action = (
		type == 'album' ?
		`/dash?/delalb` :
		`/dash?/delimg`
	)

	let bgurl = (
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

<form class='row bg-gray-300 dark:bg-gray-700'
	method="post" {action} use:enhance
>
	<input type="hidden" name="hid" id="hid" value={itm.hid}>
	{#if bgurl}
		<div class='wrapper' style="background-image: url('{bgurl}')">
		</div>
	{:else}
		<div class='wrapper flex justify-center items-center text-3xl'>
			<Image />
		</div>
	{/if}
	<div class='info'>
		<a href={url}>{itm.name}</a>
	</div>
	<div class='btns'>
		{#if !deleting}
			<Button class="my-1" size="xs" onclick={(e) => toggle(e)}>
				<Edit />
			</Button>
			<Button class="my-1" size="xs" onclick={(e) => setDelete(e)}>
				<Delete />
			</Button>
		{:else}
			<Button class="my-1" size="xs" type="submit">
				<Check />
			</Button>
			<Button class="my-1" size="xs" onclick={(e) => cancelDelete(e)}>
				<Cancel />
			</Button>
		{/if}
	</div>
</form>

<style>
.row {
	height: 50px;
	margin: .5rem;
	padding: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: .5rem;
	flex: 1 0;
}

.row .wrapper {
	width: 60px;
	height: 60px;
	padding: 0;
	margin: 0 .5rem;
	object-fit: cover;
	object-position: center;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	flex-shrink: 0;
	border-radius: 5px;
}

.row .info {
	width: 100%;
	height: 50px;
	flex: 1 0;
	margin: 0;
	padding: 0;
	display: flex;
	text-align: left;
	flex-direction: column;
	align-items: space-around;
	justify-content: center;
}

.row .btns {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	margin-right: .5rem;
}

h2 {
	margin: 0;
	padding: 0;
}

a {
	font-weight: bold;
}

a:hover {
	text-decoration: underline;
}
</style>