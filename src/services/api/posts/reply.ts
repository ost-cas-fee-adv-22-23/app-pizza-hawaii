import { TPost } from '../../../types';

type TReply = {
	text: string;
	file?: string | null;
	replyTo?: string;
};

export type TUploadImageFile = File & { preview: string };

// reply to another post id
export const reply = async ({ text, file, replyTo }: TReply): Promise<TPost> => {
	console.log('11 postreply.ts id, text', replyTo, text);

	const res = await fetch(`../api/posts/${replyTo}`, {
		method: 'POST',
		body: JSON.stringify({ text, file, replyTo }),
	});

	console.log('res from reply.ts', res);
	return (await res.json()) as TPost;
};
