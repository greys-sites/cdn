import { error, json } from '@sveltejs/kit';
import { unlink } from 'fs/promises';
import { FILES } from '$lib/constants';

import Images from '$lib/stores/images.js';

export async function PATCH({ request, params, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");
	var img = await Images.get(params.slug);
	if(!img) return error(404, "image not found.");

	var fd = await request.json();
	var name = fd.name ?? img.name;
	var hid = fd.hid ?? img.hid;
	var description = fd.description ?? img.description;
	var album = fd.album ?? img.album ?? null;

	img.name = name;
	img.hid = hid;
	img.description = description;
	img.album = album;

	await img.save();

	return json(img);
}

export async function GET({ params, locals }) {
	// if(!locals?.verified) return [];

	var image = await Images.get(params.slug);
	if(!image) return error(404, "image not found.");

	image.path = `/img/${image.hid}.${image.mime}`;

	return json(image);
}

export async function DELETE({ request, params, locals }) {
	if(!locals?.verified) return [];

	var image = await Images.get(params.slug);
	if(!image) return error(404, "image not found.");

	await image.delete();
	try {
		await unlink(`${FILES}/${image.hid}.${image.mime}`)
	} catch(e) {
		console.log(e);
	}
	return json({});
}