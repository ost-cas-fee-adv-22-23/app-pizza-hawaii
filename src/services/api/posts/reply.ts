import { TPost } from '../../../types';

type TReply = {
	method: 'POST';
	text: string;
	file?: File;
	replyTo?: string;
	accessToken?: string;
};

const BASE_URL = 'https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app';
// export type TUploadImageFile = File & { preview: string };
// reply to another post id
export const reply = async ({ method = 'POST', text, file, replyTo = '', accessToken }: TReply): Promise<TPost> => {
	if (!accessToken) {
		throw new Error('Access token is required');
	}

	const replyUrl = `${BASE_URL}/posts/${replyTo}`;

	console.log('replyUrl', replyUrl);
	const formData = new FormData();
	formData.append('text', text);
	if (file) {
		formData.append('image', file);
	}

	try {
		const res = await fetch(replyUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			method,
			body: formData,
		});

		console.log('---> result status', res.status);

		if (res.status === 201) {
			console.log('yup, 201 something good happened');
		}
		if (res.status !== 200) {
			console.error('Error in reply.ts');
		}
		const result = await res.json();
		console.log('---> result from reply.ts', result);
		return result;
	} catch (error) {
		console.error('Error in reply.ts', error);
		throw error;
	}
};
