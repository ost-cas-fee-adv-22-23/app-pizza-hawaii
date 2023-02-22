// get all details of a single Post (Mumble by Id)
import { decodeTime } from 'ulid';

export const getPostById = async (id: string) => {
	if (!id) {
		throw new Error('no valid id was provided');
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}`, {
			method: 'GET',
		});
		console.log('line:58 response', response);
		if (!response.ok) {
			throw new Error('Something went wrong  with the response!');
		}

		return transformPost(await response.json());
	} catch (error) {
		throw new Error('could not reach API');
	}
};

const transformPost = (post: RawPost) => ({
	...post,
	createdAt: new Date(decodeTime(post.id)).toISOString(),
});
