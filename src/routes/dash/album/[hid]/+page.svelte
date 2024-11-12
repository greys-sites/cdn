<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import { fly } from 'svelte/transition';

	import {
		Modal,
		Fileupload,
		Label,
		Helper,
		Button,
		Input,
		Select,
		Textarea
	} from 'flowbite-svelte';

	import AddPhoto from '~icons/ic/round-add-photo-alternate';
	import Folder from '~icons/ic/round-folder';
	import Plus from '~icons/ic/round-plus';

	import Card from '$lib/components/card.svelte';
	import Row from '$lib/components/row.svelte';
	import AlbumEditModal from '$lib/components/albumEdit.svelte';
	import ImageEditModal from '$lib/components/imageEdit.svelte';

	import { settings } from '$lib/stores/settings';

	let view = $derived($settings.get('view'));

	/** @type {{form: any, data: any}} */
	let { form, data } = $props();

	let album = $derived(data?.album ?? {});
	let images = $derived(data?.album?.images ?? []);

	let open = $state(false);
	let imgModal = $state(false);
	let albModal = $state(false);

	let imgError = $state(null);
	let albError = $state(null);

	let imgEditModal = $state(false);
	let imgEdit = $state(null);

	let albOpts = $derived.by(() => {
		return [{ value: null, name: "Unsorted" }]
		.concat(data?.all?.map(a => ({
			value: a.hid,
			name: a.name
		}) ?? []));
	})

	let toggleImageEdit = (img) => {
		imgEditModal = true;
		imgEdit = img;
	}

	$effect(() => {
		if(!data.user) goto('/dash');
	});

	let toggle = (e) => {
		e.preventDefault();
		open = !open;
	}

	let openImgModal = () => {
		imgModal = true;
		open = false;
	}

	let closeImgModal = () => {
		imgModal = false;
		open = false;
	}

	let openAlbModal = () => {
		albModal = true;
		open = false;
	}

	let closeAlbModal = () => {
		albModal = false;
		open = false;
	}
</script>

<Modal title="Add Image" bind:open={imgModal} outsideclose>
	{#if imgError}
		<Alert>
			<span class="font-bold">Error:</span> {imgError}
		</Alert>
	{/if}
	<form action="/dash?/upload" method="POST" enctype="multipart/form-data" use:enhance>
		<input name="album" id="album" type="hidden" value={album.hid}>
		<Label for="with_helper" class="pb-2">Upload file</Label>
		<Fileupload name="files" id="with_helper" class="mb-2" />
		<Helper>SVG, PNG, JPG, GIF, WEBP, or whatever else really</Helper>
		
		<Button type="submit" class="mt-4">Submit</Button>
	</form>
</Modal>

<AlbumEditModal bind:open={albModal} alb={album} />
<ImageEditModal bind:open={imgEditModal} img={imgEdit} opts={albOpts} />

<div class="fab-wrapper">
	{#if open}
		<div transition:fly={{ duration: 500, y: 20 }}>
			<button class="fab text-black dark:text-white">
			  <AddPhoto class="m-auto" onclick={openImgModal} />
			</button>
			<br />
			<button class="fab text-black dark:text-white">
			  <Folder class="m-auto" onclick={openAlbModal}/>
			</button>
		</div>
	{/if}
	<button class="fab text-black dark:text-white" class:open onclick={toggle}>
	  <Plus class="m-auto" />
	</button>
</div>

<h1 class="text-2xl font-bold mt-4">Dashboard</h1>
<Button href="/dash">Go Back</Button>

<div class="container bg-gray-200 dark:bg-gray-800 text-black dark:text-slate-400">
	<h2 class="text-xl font-bold">{album?.name} ({album.hid})</h2>
	<p class="text-center">{album?.description ?? "No description."}</p>
</div>

<h2 class="text-xl font-bold mt-4">Images</h2>
{#if images?. length}
	<div class="container">
		{#each images as img (img.hid)}
			{#if view == 'grid'}
				<Card itm={img} toggleEdit={toggleImageEdit} type="image" />
			{:else}
				<Row
					itm={img}
					toggleEdit={toggleImageEdit}
					type="image"
				/>
			{/if}
		{/each}
	</div>
{:else}
	<p class="opacity-50 mt-4">Nothing has been uploaded yet.</p>
{/if}

<style lang="postcss">
	* {
		box-sizing: border-box;
	}

	form {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	b {
		@apply font-bold;
	}

	.fab-wrapper {
		@apply fixed;
		@apply bottom-0;
		@apply right-0;
		@apply p-2;
	}

	.fab {
		height: 4rem;
		width: 4rem;
		border: 0px;
		border-radius: 50%;
		background-color: #55aaaa;
		line-height: 2rem;
		font-size: 2rem;
		opacity: .5;
		margin-bottom: .5rem;
		transition: all .25s;
	}

	.fab:hover {
		opacity: 1;
	}

	.fab.open {
		transform: rotate(45deg);
	}
</style>