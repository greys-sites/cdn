import { error, json } from '@sveltejs/kit';
import { API_TOKEN as TOKEN } from '$env/static/private';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

import { FILES } from '$lib/constants.js';
import Images from '$lib/stores/images.js';

const MIME_MAP = {
	'image/jpeg': 'jpeg',
	'image/gif': 'gif',
	'image/png': 'png',
	'image/webp': 'webp'
}

export async function POST({ request, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");

	if(!existsSync(FILES)) await mkdir(FILES);
	
	var fd = await request.formData();
	console.log(fd);
	var files = fd.getAll('files');
	console.log(files)
	var hids = JSON.parse(fd.get('hids')) ?? [];
	var descs = JSON.parse(fd.get('descs')) ?? [];
	var album = fd.get('album') ?? null; 

	var imgs = []
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		var name = f.name;
		var mime = MIME_MAP[f.type];

		var img = await Images.create({
			name,
			mime,
			album,
			description: descs[i],
			hid: hids[i]
		})

		await writeFile(`${FILES}/${img.hid}.${mime}`, Buffer.from(await f.arrayBuffer(), "binary"));
		img.path = `/img/${img.hid}.${img.mime}`;
		imgs.push(img);
	}

	return json(imgs);
}

export async function GET({ request, locals }) {
	if(!locals?.verified) return [];

	var images = await Images.getAll();

	for(var img of images) {
		img.path = `/img/${img.hid}.${img.mime}`;
	}

	// console.log(images);
	return json(images);
}