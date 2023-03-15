import { TPost } from '../../../types';

type TGetPost = {
	id: string;
};

export const unlike = async ({ id }: TGetPost) => {
	return await fetch(`api/posts/${id}/unlike`);
};
