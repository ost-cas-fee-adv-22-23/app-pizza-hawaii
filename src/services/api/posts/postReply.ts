import { TPost } from '../../../types';

type TpostPost = {
	id: string;
	text: string;
};

// reply to another post id
export const postReply = async ({ id, text }: TpostPost): Promise<TPost> => {
	const res = await fetch(`api/posts/${id}/`, {
		method: 'POST',
		body: JSON.stringify({ id, text }),
	});

	console.log('res from postreply.ts', res);
	return (await res.json()) as TPost;
};
