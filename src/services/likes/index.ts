import { fetchItem } from '../qwacker';

type TLikeProps = {
	id: string;
	method: 'PUT' | 'DELETE';
	accessToken: string;
};

/**
 * Like a post
 *
 * @param {string} id id of the post
 * @param {string} method method of the request
 * @param {string} accessToken access token of the user who is liking the post
 *
 *  @returns {Promise<TPost>}
 *
 */
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
