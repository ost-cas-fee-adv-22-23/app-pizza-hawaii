import { TPost } from '../../../types';

type TReply = {
	text: string;
	file?: string | void | null;
	replyTo?: string;
	accessToken: string;
};

export type TUploadImageFile = File & { preview: string };

// reply to another post id
export const reply = async ({ text, file, replyTo = '', accessToken }: TReply): Promise<TPost> => {
	console.log('12 postreply.ts id, text, accessToken', replyTo, text, accessToken);
	
	const bodyPayload = new FormData();
	bodyPayload.append('text', text);
	if (file) {
		bodyPayload.append('image', file);
	}

	console.log('13 postreply.ts bodyPayload', bodyPayload);
/*
	const bodyPayload = JSON.stringify({
		text: text,
		image: file,
	});

	const bodyPayload2 = new FormData();
	bodyPayload2.append('text', JSON.stringify(text));
	if (file) {
		bodyPayload2.append('image', file);
	}
*/

	const res = await fetch(`api/posts/${replyTo}`, {
		method: 'POST',
		body: bodyPayload,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	console.log('---> result from reply.ts', res);
	if (res.status === 200) {
		console.error('Error in reply.ts')
	}

	return (await res.json()) as TPost;
};
