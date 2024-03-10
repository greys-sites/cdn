import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var images = [];
	var albums = [];

	var d;
	try {
		d = await axios.get(API + `/verify`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;

		var r = await fetch('/api/images', {
			headers: {
				'Authorization': u
			}
		})
		if(r) images = await r.json();

		r = await fetch('/api/albums', {
			headers: {
				'Authorization': u
			}
		})
		if(r) albums = await r.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user', { path: "/" });
				d = null;
				// throw redirect(308, '/admin/login');
				break;
			default:
				d = null;
				break;
		}
	}

	return { id: 'login', user: u, images, albums, API };
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
	
	upload: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');

		try {
			var res = await fetch("/api/images", {
				method: 'POST',
				body: d,
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

		if(res) res = await res.json();
		console.log(res)
		return { id: 'upload', success: true, created: res };
	},
	'create-album': async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');

		console.log(d);
		var hid = d.get('hid');
		var name = d.get('name');
		var description = d.get('description');
		var cover_url = d.get('cover_url');

		try {
			var res = await fetch("/api/albums", {
				method: "POST",
				body: {
					hid,
					name,
					description,
					cover_url
				},
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

		if(res) res = await res.json();
		console.log(res)
		return { id: 'create-album', success: true, created: res };
	},
	
	delimg: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("hid");

		try {
			var res = await fetch(`/api/delete/${hid}`, {
				method: "DELETE",
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

		if(res) res = await res.json();
		console.log(res)
		return { id: 'delete-image', success: true, deleted: hid };
	},
	delalb: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("hid");

		try {
			var res = await axios.post(`/api/albums/delete/${hid}`, {
				method: "DELETE",
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

		if(res) res = await res.json();
		console.log(res)
		return { id: 'delete-album', success: true, deleted: hid };
	},
	
	editimg: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("oldhid");
		var newhid = d.get("newhid");

		try {
			var res = await fetch(`/api/images/${hid}`, {
				method: "PATCH",
				body: {
					hid: newhid ?? hid,
					name: d.get('name'),
					description: d.get('description'),
					album: d.get('album')
				},
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
		return { id: 'editimg', success: true, data: res };
	},
	editalb: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("oldhid");

		try {
			var res = await fetch(`/api/albums/${hid}`, {
				method: "PATCH",
				body: {
					hid: d.get('hid') ?? hid,
					name: d.get('name'),
					description: d.get('description'),
					cover_url: d.get('cover_url')
				},
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
		return { id: 'editalb', success: true, data: res };
	},
}