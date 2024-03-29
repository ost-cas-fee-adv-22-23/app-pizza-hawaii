type TGetPost = {
	id: string;
};

/**
 * Like a post
 *
 * @param {string} id - The id of the post to like
 * @returns {Promise<Response>}
 */

export const like = async ({ id }: TGetPost) => {
	return await fetch(`/api/posts/${id}/like`, {
		method: 'PUT',
	});
};

/**
 * UnLike a post
 *
 * @param {string} id - The id of the post to like
 * @returns {Promise<Response>}
 */

export const unlike = async ({ id }: TGetPost) => {
	return await fetch(`/api/posts/${id}/like`, {
		method: 'DELETE',
	});
};
