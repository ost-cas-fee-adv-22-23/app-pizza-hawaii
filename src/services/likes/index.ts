import { fetchItem } from '../qwacker';

const STATUS_MESSAGE_MAP: Record<number, string> = {
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
	const res = fetchItem({
		endpoint: `posts/${id}/likes/`,
		accessToken,
		method,
	});

	if (!res) {
		console.error(STATUS_MESSAGE_MAP[res.status]);
		return false;
	}

	return true;
};

export const likesService = {
	like,
};
