import { error, json } from '@sveltejs/kit';

import Images from '$lib/stores/images.js';

export async function PATCH({ request, params, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");
	var img = await Images.get(params.slug);
	if(!img) return error(404, "image not found.");

	var fd = await request.formData();;
	var name = fd.get('name') ?? img.name;
	var hid = fd.get('hid') ?? img.hid;
	var description = fd.get('description') ?? img.description;
	var album = fd.get('album') ?? img.album ?? null;

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

	// console.log(images);
	return json(image);
}

export async function DELETE({ request, params, locals }) {
	if(!locals?.verified) return [];

	var image = await Images.get(params.slug);
	if(!image) return error(404, "image not found.");

	await image.delete();
	return json({});
}