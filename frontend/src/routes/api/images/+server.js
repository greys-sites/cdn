import { error, json } from '@sveltejs/kit';
import { API_TOKEN as TOKEN } from '$env/static/private';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

import Images from '$lib/stores/images.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dir = `${__dirname}/../../../../files`;

export async function POST({ request, locals }) {
	if(!locals?.verified) return error(401, "Unauthorized.");

	if(!existsSync(dir)) await mkdir(dir);
	
	var fd = await request.formData();
	console.log(fd);
	var files = fd.getAll('files');
	console.log(files)

	return json({})
}

export async function GET({ request, locals }) {
	console.log(request, locals);
	if(!locals?.verified) return [];

	var images = await Images.getAll();
	console.log(images);

	return json(images);
}