const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

const BASE_URL = process.env.NEXT_PUBLIC_QWACKER_API_URL;

async function fetchQwackerApi(endpoint: string, accessToken?: string, options: object = {}) {
	const url = `${BASE_URL}/${endpoint}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		...options,
	});

	if (!res.ok) {
		throw new Error(`Qwacker API request failed with status ${res.status} (${res.statusText})`);
	}

	if (res.status === 204) {
		return true;
	}
	if (res.status !== 200) {
		// TODO handle errors
		new Error(statusMessageMap[res.status]);
		return false;
	}

	return await res.json();
}

export default fetchQwackerApi;