import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var d;
	try {
		d = await axios.get(API + `/verify`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user');
				d = null;
				// throw redirect(308, '/admin/login');
				break;
			default:
				d = null;
				break;
		}
	}

	return { user: u };
}

export const actions = {
	login: async ({ cookies, request }) => {
		var d = await request.formData();
		var token = d.get('token');

		try {
			var u = await axios.post(API + '/login', {
				token
			});

			if(u) {
				u = u.data;
				console.log(u);
				cookies.set('user', token, {
					path: '/'
				});
			} else return fail(401, {
				success: false,
				status: 401,
				message: "Login information is incorrect."
			});
		} catch(e) {
			console.log(e);
			return fail(401, {
				success: false,
				status: 401,
				message: "Login information is incorrect."
			});
		}
	}
}