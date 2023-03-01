import { TPost } from '../../../types';

type TGetPost = {
	id: string;
};

export const get = async ({ id }: TGetPost): Promise<TPost> => {
	const res = await fetch(`api/posts/${id}/`);
	return (await res.json()) as TPost;
};
