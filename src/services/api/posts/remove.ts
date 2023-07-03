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
	return await fetch(`/api/posts/${id}`, {
		method: 'DELETE',
	});
};
