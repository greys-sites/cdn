<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms'

	import {
		Input,
		Button,
		Label
	} from 'flowbite-svelte';
	
	let { children } = $props();
</script>

{#if $page?.data?.user}
	{@render children()}
{:else}
	<form action="/dash?/login" method="post" use:enhance>
      <Label for="token">Token:</Label>
      <Input type="password" name="token" id="token" size="small" />
      <Button name="submit" type="submit">Login</Button>
    </form>
{/if}