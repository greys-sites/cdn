import { API_TOKEN as TOKEN } from '$env/static/private';

export async function handle({ event, resolve }) {
	var tk = event.cookies.get('user');
	if(!tk) tk = event.request.headers.get('authorization');

	event.locals.verified = tk == TOKEN;
	const response = await resolve(event);
	return response;
}