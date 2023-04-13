const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TRemovePost = {
	id: string;
};

/**
 * Remove a post
 *
 * @param {string} id
 * @returns {Promise<TPost>}
 */

export const remove = async ({ id }: TRemovePost) => {
	return await fetch(`${BASE_URL}/api/posts/${id}`, {
		method: 'DELETE',
	});
};
