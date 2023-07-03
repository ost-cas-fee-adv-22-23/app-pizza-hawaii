import { TPost } from '../../../types';

type TGetPost = {
	id: string;
};

/**
 * Get a single post by id
 * @param {string} id
 */

export const get = async ({ id }: TGetPost): Promise<TPost> => {
	const res = await fetch(`/api/posts/${id}/`);
	return (await res.json()) as TPost;
};
