import fetchQwackerApi from "../qwacker";

const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

type TLikeProps = {
	id: string;
	accessToken: string;
};

const like = async ({ id, accessToken }: TLikeProps) => {
	const res = await fetchQwackerApi(`posts/${id}/likes/`, accessToken, {
		method: 'PUT',
	});

	if (res.status !== 204) {
		console.error(statusMessageMap[res.status]);
		return false;
	}

	return true;
};

const unlike = async ({ id, accessToken }: TLikeProps) => {
	const res = await fetchQwackerApi(`posts/${id}/likes/`, accessToken, {
		method: 'DELETE',
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
