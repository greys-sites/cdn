import { API_TOKEN as TOKEN } from '$env/static/private';

export async function handle({ event, resolve }) {
	event.locals.verified = event.cookies.get('user') == TOKEN;

	const response = await resolve(event);
	return response;
}