<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

	import { fly } from 'svelte/transition';

	import {
		Modal,
		Fileupload,
		Label,
		Helper,
		Button,
		Input,
		Select
	} from 'flowbite-svelte';

	import AddPhoto from '~icons/ic/round-add-photo-alternate';
	import NewFolder from '~icons/ic/round-create-new-folder';
	import Plus from '~icons/ic/round-plus';

	import Album from '$lib/components/album.svelte';
	import Card from '$lib/components/card.svelte';
	import Row from '$lib/components/row.svelte';

	import { settings } from '$lib/stores/settings';

	let view = $derived($settings.get('view'));

	import ImageEditModal from '$lib/components/imageEdit.svelte';
	import AlbumEditModal from '$lib/components/albumEdit.svelte';

	/** @type {{form: any, data: any}} */
	let { form, data } = $props();

	let albums = $derived.by(() => data?.albums ?? []);
	let images = $derived.by(() => data?.images?.filter(x => !x.album || !albums.find(a => a.hid == x.album)) ?? []);

	$effect(() => {
		if(form?.id == "login" && form?.success) goto('/dash');
	});

	let open = $state(false);
	let imgModal = $state(false);
	let albModal = $state(false);

	let imgError = $state(null);
	let albError = $state(null);

	let imgEditModal = $state(false);
	let imgEdit = $state(null);
	let albEditModal = $state(false);
	let albEdit = $state(null);

	let albSelect = $state(null);
	let albOpts = $derived.by(() => {
		return [{ value: null, name: "Unsorted" }]
		.concat(data?.albums?.map(a => ({
			value: a.hid,
			name: a.name
		}) ?? []));
	})

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

	let toggleImageEdit = (img) => {
		imgEditModal = true;
		imgEdit = img;
	}

	let toggleAlbumEdit = (alb) => {
		albEditModal = true;
		albEdit = alb;
	}
</script>

<Modal title="Add Image" bind:open={imgModal} outsideclose>
	{#if imgError}
		<Alert>
			<span class="font-bold">Error:</span> {imgError}
		</Alert>
	{/if}
	<form action="?/upload" method="POST" enctype="multipart/form-data" use:enhance>
		<Label for="with_helper" class="pb-2">Upload file</Label>
		<Fileupload name="files" id="with_helper" class="mb-2" />
		<Helper>SVG, PNG, JPG, GIF, WEBP, or whatever else really</Helper>

		<Label for="album" class="pb-2">Album</Label>
		<Select name="album" id="album" items={albOpts} bind:value={albSelect} />
		
		<Button type="submit" class="mt-4">Submit</Button>
	</form>
</Modal>

<Modal title="Add Album" bind:open={albModal} outsideclose>
	{#if albError}
		<Alert>
			<span class="font-bold">Error:</span> {albError}
		</Alert>
	{/if}

	<form action="?/create-album" method="POST" enctype="multipart/form-data" use:enhance >
	  <Label for="name">Album name</Label>
	  <Input name="name" id="name" type="text" placeholder="name" />
	  <Label for="hid">Album ID</Label>
	  <Input name="hid" id="hid" type="text" placeholder="hid" />
	  <Button type="submit">Create</Button>
	</form>
</Modal>

<ImageEditModal bind:open={imgEditModal} img={imgEdit} />
<AlbumEditModal bind:open={albEditModal} alb={albEdit} />

<div class="fab-wrapper">
	{#if open}
		<div transition:fly={{ duration: 500, y: 20 }}>
			<button class="fab text-black dark:text-white">
			  <AddPhoto class="m-auto" onclick={openImgModal} />
			</button>
			<br />
			<button class="fab text-black dark:text-white">
			  <NewFolder class="m-auto" onclick={openAlbModal}/>
			</button>
		</div>
	{/if}
	<button class="fab text-black dark:text-white" class:open onclick={toggle}>
	  <Plus class="m-auto" />
	</button>
</div>

<h1 class="text-2xl font-bold mt-4">Dashboard</h1>

{#if albums?.length}
<h2 class="text-xl font-bold">Albums</h2>
<div class="container">
	{#each albums as alb (alb.hid)}
		{#if view == 'grid'}
			<Album {alb} toggleEdit={toggleAlbumEdit}/>
		{:else}
			<Row
				itm={alb}
				toggleEdit={toggleAlbumEdit}
				type="album"
			/>
		{/if}
	{/each}
</div>
{/if}

{#if images?.length}
<h2 class="text-xl font-bold">Unsorted Images</h2>
<div class="container">
	{#each images as img (img.hid)}
		{#if view == 'grid'}
			<Card {img} toggleEdit={toggleImageEdit}/>
		{:else}
			<Row
				itm={img}
				toggleEdit={toggleImageEdit}
				type="image"
			/>
		{/if}
	{/each}
</div>
{/if}

{#if !albums?.length && !images?.length}
	<p class="opacity-50 mt-4">Nothing has been uploaded yet.</p>
{/if}

<style lang="postcss">
	* {
		box-sizing: border-box;
	}

	div {
		text-align: center;
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