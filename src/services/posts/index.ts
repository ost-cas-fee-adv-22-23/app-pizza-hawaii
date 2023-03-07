import { decodeTime } from 'ulid';
import { TPost } from '../../types';

type TUploadImage = File & { preview: string };

type TRawPost = Omit<TPost, 'createdAt'>;

/**
 * Get all posts
 *
 * @param {string} newerThan id of the newest post
 * @param {string} olderThan id of the oldest post
 * @param {number} limit
 * @param {number} offset default 0
 * @param {string} accessToken
 *
 * @returns {Promise<{ count: number; users: TPost[] }>}
 */

type TGetPost = {
	newerThan?: string;
	olderThan?: string;
	limit?: number;
	offset?: number;
	accessToken?: string;
};

type TGetPostResult = {
	count: number;
	posts: TPost[];
};

const getPosts = async ({ newerThan, olderThan, limit, offset = 0, accessToken }: TGetPost): Promise<TGetPostResult> => {
	const maxLimit = 1000;

	// create url params
	const urlParams = new URLSearchParams({
		offset: offset.toString(),
	});

	if (limit !== undefined) {
		urlParams.set('limit', Math.min(limit, maxLimit).toString());
	}
	if (newerThan !== undefined) {
		urlParams.set('newerThan', newerThan);
	}
	if (olderThan !== undefined) {
		urlParams.set('olderThan', olderThan);
	}

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts?${urlParams}`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const { count, data } = (await res.json()) as { count: number; data: TRawPost[] };
	const posts = data.map(transformPost) as TPost[];

	// load more posts if limit is not set and the amount of posts is less than the total count
	if (limit === undefined && posts.length < count) {
		const remainingOffset = offset + posts.length;
		const { posts: remainingPosts } = await getPosts({
			newerThan,
			olderThan,
			offset: remainingOffset,
			accessToken,
		});

		return {
			count,
			posts: [...posts, ...remainingPosts],
		};
	}

	return {
		count,
		posts,
	};
};

/**
 * Get a single post by id
 *
 * @param {string} id
 * @param {string} accessToken
 *
 * @returns {Promise<TPost>}
 *
 * @throws {Error} if no valid id was provided
 * @throws {Error} if the response was not ok
 *
 */
type TGetPostById = {
	id: string;
	accessToken: string;
};

const getPostById = async ({ id, accessToken }: TGetPostById) => {
	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const post = (await res.json()) as TRawPost;
	return transformPost(post);
};

// get all Replies for a given Post Id
const getRepliesById = async ({ id, accessToken }: TGetPostById) => {
	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}/replies`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const post = (await res.json()) as TRawPost;
	return transformPost(post);
};

type TGetPostQueryObj = {
	text?: string;
	tags?: string[];
	mentions?: string[];
	isReply?: boolean;
	offset?: number;
	limit?: number;
};

type TGetPostByQuery = {
	query: TGetPostQueryObj;
	accessToken: string;
};

// search for posts by a search object
const searchPostbyQuery = async ({ query, accessToken }: TGetPostByQuery) => {
	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/search`;

	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(query),
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const { count, data } = (await res.json()) as { count: number; data: TRawPost[] };
	const posts = data.map(transformPost) as TPost[];

	return {
		count,
		posts,
	};
};

// TODO: implement this in a better way
const getPostsByUserId = async ({ id, accessToken }: TGetPostById) => {
	const { posts } = await getPosts({
		accessToken,
	});

	return posts.filter((post) => post.creator === id) as TPost[];
};

// TODO: implement this in a better way
const getLikedPostsByCurrentUser = async ({ id, accessToken }: TGetPostById) => {
	console.log('current user id', id);
	const { posts } = await getPosts({
		accessToken,
	});

	return posts.filter((post) => post.likedByUser) as TPost[];
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

const transformPost = (post: TRawPost) => ({
	...post,
	createdAt: new Date(decodeTime(post.id)).toISOString(),
});

export const postsService = {
	getPosts,
	addPost,
	getPostById,
	getPostsByUserId,
	getLikedPostsByCurrentUser,
	getRepliesById,
	searchPostbyQuery,
};
