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
  
  let { open = $bindable(), alb, error } = $props();
</script>

<Modal title="Edit Album" bind:open={open} size="xs" autoclose={false} outsideclose>
    <form method="post" action="/dash?/editalb" use:enhance>
		<input type="hidden" name="oldhid" id="oldhid" value={alb.hid} />
		<Label for="hid">Album ID</Label>
		<Input class="mb-2"
			type="text" value={alb.hid} id="hid" name="hid" placeholder="hid"
		/>
		<Label for="name">Album name</Label>
		<Input class="mb-2"
			type="text" value={alb.name} id="name" name="name" placeholder="name"
		/>
		<Label for="cover_url">Album cover</Label>
		<Input class="mb-2"
			type="text" value={alb.cover_url} id="cover_url" name="cover_url" placeholder="cover url"
		/>
		<Label for="description">Album description</Label>
		<Textarea class="mb-2"
			rows=10 id="description" name="description" placeholder="description"
			value={alb.description}
		/>

		<Button type="submit" onclick={() => {
			// autclose destroys the form before it sends the submit
			// this timeout lets it submit before closing
			setTimeout(() => open = false, 250)
		}}>Save</Button>
	</form>
</Modal>