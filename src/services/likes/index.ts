const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

const urlMap: Record<string, string> = {
	like: `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/{id}/likes/`,
	unlike: `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/{id}/likes/`,
};

const like = async (id: string, accessToken: string) => {
	const url = urlMap['like'].replace('{id}', id);

	const res = await fetch(url, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (res.status !== 204) {
		console.error(statusMessageMap[res.status]);
		return false;
	}

	return true;
};

const unlike = async (id: string, accessToken: string) => {
	const url = urlMap['unlike'].replace('{id}', id);

	const res = await fetch(url, {
		method: 'DELETE',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (res.status !== 204) {
		console.error(statusMessageMap[res.status]);
		return false;
	}

	return true;
};

export const likesService = {
	like,
	unlike,
};
