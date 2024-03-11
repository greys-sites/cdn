import { error, json } from '@sveltejs/kit';

import Albums from '$lib/stores/albums.js';

export async function PATCH({ request, params, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");
	var alb = await Albums.get(params.slug);
	if(!alb) return error(404, "album not found.");

	var fd = await request.json();
	var name = fd.name ?? alb.name;
	var hid = fd.hid ?? alb.hid;
	var description = fd.description ?? alb.description;
	var cover_url = fd.cover_url ?? alb.cover_url;

	alb.name = name;
	alb.hid = hid;
	alb.description = description;
	alb.cover_url = cover_url;
	await alb.save();

	return json(alb);
}

export async function GET({ params, locals }) {
	// if(!locals?.verified) return [];

	var album = await Albums.get(params.slug);
	if(!album) return error(404, "album not found.");

	await album.getImages();

	return json(album);
}

export async function DELETE({ request, params, locals }) {
	if(!locals?.verified) return [];

	var album = await Albums.get(params.slug);
	if(!album) return error(404, "album not found.");

	await album.delete();
	return json({});
}