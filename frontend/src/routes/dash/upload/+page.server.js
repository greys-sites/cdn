import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const actions = {
	upload: async ({ cookies, request }) => {
		var d = await request.formData();

		var token = cookies.get('user');

		try {
			var res = await axios.post(API + "/upload", d, {
				headers: {
					Authorization: token,
					"Content-Type": "multipart/formdata"
				}
			})
		} catch(e) {
			return fail(e.status, {
				success: false,
				status: e.response.status,
				message: e.response.data
			})
		}

		if(res) res = res.data;
		return { success: true, created: res };
	}
}