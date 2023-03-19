import { TPost } from '../../../types';

type TCreatePost = {
	replyTo?: string;
	text: string;
	file?: File;
	// method: 'POST';
};

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export const create = async ({ replyTo, text, file }: TCreatePost): Promise<TPost> => {
	console.log('%ccreate.ts line:12 text, file', 'color: white; background-color: #007acc;', text, file);

	// internal route API
	let url = `${BASE_URL}/api/posts/new`;
	if (replyTo) {
		url = `${BASE_URL}/api/posts/${replyTo}/reply`;
	}

	console.log('create at services url', url);

	const formData = new FormData();
	formData.append('text', text);
	if (file) {
		formData.append('image', file);
	}

	console.log('create at services formData', formData);
	const res = await fetch(url, { body: formData, method: 'POST' });
	console.log('res create', res);
	if (res.status === 201) {
		console.log('yup, 201 something good happened');
	}
	return (await res.json()) as TPost;
};
