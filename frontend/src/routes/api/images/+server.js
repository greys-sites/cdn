import { error, json } from '@sveltejs/kit';
import { API_TOKEN as TOKEN } from '$env/static/private';

import Images from '$lib/stores/images.js';

export async function GET({ request, locals }) {
	console.log(request, locals);
	if(!locals?.verified) return [];

	var images = await Images.getAll();
	console.log(images);

	return json(images);
}