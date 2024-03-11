import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies, params, fetch, locals }) {
	if(!locals.verified) {
		cookies.delete('user', { path: "/" });
		return redirect(307, '/dash');
	}

	var u = cookies.get('user');

	var album = {}

	try {
		var r = await fetch(`/api/albums/${params.hid}`, {
			headers: {
				'Authorization': u
			}
		})
		if(r) album = await r.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 404:
				album = null;
				break;
			default:
				album = null;
				break;
		}
	}

	return { user: u, album, API };
}