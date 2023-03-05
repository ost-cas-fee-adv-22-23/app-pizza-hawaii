import { TPost } from '../../../types';

type TGetPost = {
	id: string;
};

export const unlike = async ({ id }: TGetPost): Promise<TPost> => {
	const res = await fetch(`api/posts/${id}/unlike`);
	return (await res.json()) as TPost;
};
