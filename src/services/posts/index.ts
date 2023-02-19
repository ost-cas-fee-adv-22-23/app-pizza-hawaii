import { decodeTime } from 'ulid';
import { TUser } from '../users';

export type TPost = {
	id: string;
	creator: string | TUser;
	text: string;
	mediaUrl: string;
	mediaType: string;
	likeCount: number;
	likedByUser: boolean;
	type: string;
	replyCount: number;
	createdAt: string;
};

type RawPost = Omit<TPost, 'createdAt'>;

type TPostResponse = {
	count: number;
	data: RawPost[];
};

export type TUploadImage = File & { preview: string };

const fetchPosts = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
	const { limit, offset, newerThanMumbleId } = params || {};

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts?${new URLSearchParams({
		limit: limit?.toString() || '10',
		offset: offset?.toString() || '0',
		newerThan: newerThanMumbleId || '',
	})}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
		},
	});
	const { count, data } = (await res.json()) as TPostResponse;

	const posts = data.map(transformPost);

	return {
		count,
		posts,
	};
};

// get single Post (mumble)
const getPostById = async (id: string) => {
	if (!id) {
		throw new Error('no valid id was provided');
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}`, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error('Something went wrong  with the response!');
		}

		return transformPost(await response.json());
	} catch (error) {
		throw new Error('could not reach API');
	}
};

// get all Replies for a given Post Id
const getRepliesById = async (id: string) => {
	if (!id) {
		throw new Error('getReplyById: no valid id was provided');
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}/replies`, {
			method: 'GET',
		});

		if (response.status !== 200) {
			throw new Error('Something went sour! not status 200. have a look at the network status');
		}

		return response.json()

	} catch (error) {
		throw new Error('getReplyById could not reach API');
	}
};

const addPost = async (text: string, file: TUploadImage | null, accessToken?: string) => {
	if (!accessToken) {
		throw new Error('No access token');
	}

	const formData = new FormData();
	formData.append('text', text);
	if (file) {
		formData.append('image', file);
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (!response.ok) {
			throw new Error('Something was not okay');
		}

		return transformPost(await response.json());
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Could not post Post');
	}
};
const transformPost = (post: RawPost) => ({
	...post,
	createdAt: new Date(decodeTime(post.id)).toISOString(),
});

export const postsService = {
	fetchPosts,
	addPost,
	getPostById,
	getRepliesById,
};
