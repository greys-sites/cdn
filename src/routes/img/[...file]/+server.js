import { readFile } from 'fs/promises';
import { error, json } from '@sveltejs/kit';

import { FILES } from '$lib/constants.js';

const MIME_MAP = {
	'jpeg': 'image/jpeg',
	'gif': 'image/gif',
	'png': 'image/png',
	'webp': 'image/webp' 
}

export async function GET({ request, params, locals }) {
	// if(!locals?.verified) return [];

	var f = params.file;
	var file;
	try {
		var buff = await readFile(`${FILES}/${f}`);
		file = new Blob([buff]);
	} catch(e) {
		console.log(e);
	}

	var ct = MIME_MAP[Object.keys(MIME_MAP).filter(x => f.endsWith(x))];

	return new Response(file, {
		status: 200,
		headers: {
			'Content-Type': ct,
			'Access-Control-Allow-Origin': '*'
		}
	});
}