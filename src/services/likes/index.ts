import fetchQwackerApi from '../qwacker';

const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

type TLikeProps = {
	id: string;
	method: 'PUT' | 'DELETE';
	accessToken: string;
};

const like = async ({ id, method, accessToken }: TLikeProps) => {
	const res = await fetchQwackerApi(`posts/${id}/likes/`, accessToken, {
		method,
	});

	if (res.status !== 204) {
		console.error(statusMessageMap[res.status]);
		return false;
	}

	return true;
};

export const likesService = {
	like,
};
