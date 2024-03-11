import { readFile } from 'fs/promises';
import { error, json } from '@sveltejs/kit';

import { FILES } from '$lib/constants.js';

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

	return new Response(file);
}