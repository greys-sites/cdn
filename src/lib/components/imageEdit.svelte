<script>
	import {
    Modal,
    Button,
    Label,
    Input,
    Select,
    Textarea
  } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  
  let { open = $bindable(), img, error } = $props();
</script>

<Modal title="Edit Image" bind:open={open} size="xs" autoclose={false} outsideclose>
    <form method="post" action="?/editimg" use:enhance>
		<input type="hidden" value={img.hid} name="oldhid" id="oldhid">
		<Label for="hid">Image ID</Label>
		<Input class="mb-2"
			type="text" value={img.hid} id="hid" name="hid" placeholder="hid" />

		<Label for="name">Image name</Label>
		<Input class="mb-2"
			type="text" value={img.name} id="name" name="name" placeholder="name" />

		<Label for="album">Image album</Label>
		<Input class="mb-2"
			type="text" value={img.album} id="album" name="album" placeholder="album hid" />

		<Label for="description">Image description</Label>
		<Textarea class="mb-2"
			rows=10 id="description" name="description" placeholder="description" />

		<Button type="submit" onclick={() => {
			// autclose destroys the form before it sends the submit
			// this timeout lets it submit before closing
			setTimeout(() => open = false, 250)
		}}>Save</Button>
	</form>
</Modal>