import { error, json } from '@sveltejs/kit';
import { API_TOKEN as TOKEN } from '$env/static/private';

export async function POST({ request, cookies }) {
	var b = await request.json();
	if(!b?.token) return error(400, "token not received.");

	if(b.token != TOKEN) return error(403, "invalid login.");

	cookies.set('user', TOKEN, { path: '/' });
	return json({});
}