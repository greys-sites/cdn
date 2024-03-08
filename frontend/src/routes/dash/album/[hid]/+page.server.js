import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies, params }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var album = {}

	var d;
	try {
		d = await axios.get(API + `/verify`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user', { path: "/" });
				d = null;
				break;
			default:
				d = null;
				break;
		}
	}

	try {
		var r = await axios.get(`${API}/api/albums/${params.hid}`, {
			headers: {
				'Authorization': u
			}
		})
		if(r) album = r.data;
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