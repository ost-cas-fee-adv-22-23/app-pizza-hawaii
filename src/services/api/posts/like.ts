import { TPost } from '../../../types';

type TGetPost = {
	id: string;
};

export const like = async ({ id }: TGetPost): Promise<TPost> => {
	const res = await fetch(`api/posts/${id}/like`);
	return (await res.json()) as TPost;
};
