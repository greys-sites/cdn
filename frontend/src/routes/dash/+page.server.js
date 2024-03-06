import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var images = []

	var d;
	try {
		d = await axios.get(API + `/verify`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;

		var r = await axios.get(API + '/api/images', {
			headers: {
				'Authorization': u
			}
		})
		if(r) images = r.data;
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

	return { id: 'login', user: u, images, API };
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
	},
	upload: async ({ cookies, request }) => {
		var d = await request.formData();
		var token = cookies.get('user');

		try {
			var res = await axios.post(API + "/upload", d, {
				headers: {
					Authorization: token,
					"Content-Type": "multipart/form-data"
				}
			})
		} catch(e) {
			console.log(e)
			return fail(e.status ?? 500, {
				success: false,
				status: e.response?.status,
				message: e.response?.data
			})
		}

		if(res) res = res.data;
		console.log(res)
		return { id: 'upload', success: true, created: res };
	},
	delimg: async ({ cookies, request }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("hid");

		try {
			var res = await axios.post(API + `/delete/${hid}`, null, {
				headers: {
					Authorization: token
				}
			})
		} catch(e) {
			console.log(e)
			return fail(e.status ?? 500, {
				success: false,
				status: e.response?.status,
				message: e.response?.data
			})
		}

		if(res) res = res.data;
		console.log(res)
		return { id: 'delete', success: true, deleted: hid };
	},
}