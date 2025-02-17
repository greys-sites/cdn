import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, params, fetch, locals }) {
	if(!locals.verified) {
		cookies.delete('user', { path: "/" });
		return redirect(307, '/dash');
	}

	var u = cookies.get('user');

	var album = {}
	var all = [];

	try {
		var r = await fetch(`/api/albums/${params.hid}`, {
			headers: {
				'Authorization': u
			}
		})
		if(r) album = await r.json();

		r = await fetch(`/api/albums`, {
			headers: {
				'Authorization': u
			}
		})
		if(r) all = await r.json();
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

	return { user: u, album, all };
}

export const actions = {	
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
	
	editimg: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var token = cookies.get('user');
		var hid = d.get("oldhid");
		var newhid = d.get("hid");

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
	}
}