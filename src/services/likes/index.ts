import { fetchItem } from '../qwacker';

type TLikeProps = {
	id: string;
	method: 'PUT' | 'DELETE';
	accessToken: string;
};

const like = async ({ id, method, accessToken }: TLikeProps) => {
	return fetchItem({
		endpoint: `posts/${id}/likes/`,
		accessToken,
		method,
	});
};

export const likesService = {
	like,
};
