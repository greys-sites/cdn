<script>
	import { enhance } from "$app/forms";

	export let form;
</script>

<form action="?/upload" method="post" enctype="multipart/form-data" use:enhance>
  <label>Select image(s) to upload:
  <input name="files" id="files" type="file" multiple>
  </label>
  <br>
  <input value="upload" name="submit" type="submit">
</form>