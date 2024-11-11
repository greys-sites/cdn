<script>
  import "../app.css";

  import {
  	DarkMode,
  	Button,
  	Modal,
  	Helper,
	Input,
	Select
  } from 'flowbite-svelte';

  import SettingsIcon from '~icons/ic/round-settings';

  import { settings, update } from '$lib/stores/settings';

  import SettingsModal from '$lib/components/settings.svelte';

  let { children } = $props();

  let open = $state(false);

  let toggle = (e) => {
  	e.preventDefault()
  	open = true;
  }
</script>

<svelte:head>
  <script>
    var prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if ('settings' in localStorage) {
      var st = JSON.parse(localStorage.getItem('settings'));
      if(st.theme == 'dark' || (st.theme == 'system' && prefer)) window.document.documentElement.classList.add('dark');
      else if(st.theme == 'light') window.document.documentElement.classList.remove('dark');
    } else if(prefer) {
      window.document.documentElement.classList.add('dark');  
    }
  </script>
</svelte:head>

<SettingsModal bind:open />

<Button class="ml-auto mr-4 mt-2 border-none"
	color="alternative" size="sm" onclick={toggle}
>
	<span class="sr-only">Settings</span>
	<SettingsIcon />
</Button>

{@render children()}