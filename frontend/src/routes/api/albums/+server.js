import { error, json } from '@sveltejs/kit';

import Albums from '$lib/stores/albums.js';

export async function POST({ request, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");

	var fd = await request.json();
	var name = fd.name ?? 'Untitled Album';
	var hid = fd.hid ?? null;
	var description = fd.description ?? null;
	var cover_url = fd.cover_url ?? null;

	var album = await Albums.create({
		hid,
		name,
		description,
		cover_url
	})

	return json(album);
}

export async function GET({ request, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");

	var albums = await Albums.getAll();

	return json(albums);
}