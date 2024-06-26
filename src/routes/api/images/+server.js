import { error, json } from '@sveltejs/kit';
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
	var files = fd.getAll('files');
	var hids = JSON.parse(fd.get('hids')) ?? [];
	var descs = JSON.parse(fd.get('descs')) ?? [];
	var album = fd.get('album') ?? null; 

	var imgs = [];
	var errs = [];
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		var name = f.name;
		var mime = MIME_MAP[f.type];

		var exists = await Images.get(hids[i]);
		if(exists?.id) {
			errs.push({ name, err: `hid ${hids[i]} is already in use.`});
			continue;
		}

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

	return json({ created: imgs, errors: errs });
}

export async function GET({ request, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");

	var images = await Images.getAll();

	for(var img of images) {
		img.path = `/img/${img.hid}.${img.mime}`;
	}

	return json(images);
}