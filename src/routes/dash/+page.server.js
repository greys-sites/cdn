import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, locals }) {
	if(!locals.verified) {
		cookies.delete('user', { path: "/" });
		return { user: null };
	}

	var u = cookies.get('user');

	var images = [];
	var albums = [];

	var d;
	try {
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

	return { id: 'login', user: u, images, albums };
}

export const actions = {
	login: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = d.get('token');

		try {
			var u = await fetch('/login', {
				method: "POST",
				body: JSON.stringify({token})
			});

			if(u) {
				u = await u.json();
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
		return { id: 'upload', success: true, created: res };
	},
	'create-album': async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');

		var hid = d.get('hid');
		var name = d.get('name');
		var description = d.get('description');
		var cover_url = d.get('cover_url');

		try {
			var res = await fetch("/api/albums", {
				method: "POST",
				body: JSON.stringify({
					hid,
					name,
					description,
					cover_url
				}),
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
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
		return { id: 'create-album', success: true, created: res };
	},
	
	delimg: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("hid");

		try {
			var res = await fetch(`/api/images/${hid}`, {
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
		return { id: 'delete-image', success: true, deleted: hid };
	},
	delalb: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("hid");

		try {
			var res = await fetch(`/api/albums/${hid}`, {
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
				body: JSON.stringify({
					hid: newhid ?? hid,
					name: d.get('name'),
					description: d.get('description'),
					album: d.get('album')
				}),
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
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
		return { id: 'editimg', success: true, data: res };
	},
	editalb: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("oldhid");

		try {
			var res = await fetch(`/api/albums/${hid}`, {
				method: "PATCH",
				body: JSON.stringify({
					hid: d.get('hid') ?? hid,
					name: d.get('name'),
					description: d.get('description'),
					cover_url: d.get('cover_url')
				}),
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
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
		return { id: 'editalb', success: true, data: res };
	},
}