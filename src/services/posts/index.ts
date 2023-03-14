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
 * @param {string} creator id of the user who created the post
 * @param {string} accessToken access token of the user who is fetching the posts
 *
 * @returns {Promise<{ count: number; users: TPost[] }>}
 */

type TGetPost = {
	newerThan?: string;
	olderThan?: string;
	limit?: number;
	offset?: number;
	creator?: string;
	accessToken?: string;
};

type TGetPostResult = {
	count: number;
	posts: TPost[];
};

enum EPostType {
	POST = 'post',
	REPLY = 'reply',
}

const getPosts = async ({
	newerThan,
	olderThan,
	limit,
	offset = 0,
	creator,
	accessToken,
}: TGetPost): Promise<TGetPostResult> => {
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
	if (creator !== undefined) {
		urlParams.set('creator', creator);
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
	const lastPostId = data[data.length - 1]?.id as string;
	const posts = data.filter((post) => post.type === EPostType.POST).map(transformPost) as TPost[];

	// If there are more entries to fetch, make a recursive call
	if (count > 0 && (!limit || posts.length < limit)) {
		const remainingLimit = limit && count > limit ? limit - posts.length : count;
		const { posts: remainingPosts, count: remainingCount } = await getPosts({
			limit: remainingLimit,
			newerThan,
			olderThan: lastPostId,
			creator,
			accessToken,
		});

		return {
			count: remainingCount,
			posts: [...posts, ...remainingPosts].slice(0, limit),
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

const deletePost = async ({ id, accessToken }: TGetPostById) => {
	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${id}`;

	const res = await fetch(url, {
		method: 'DELETE',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (res.status !== 204) {
		return false;
	}

	return true;
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
	const posts = (await res.json()) as TRawPost[];
	return posts.filter((post) => post.type === EPostType.REPLY).map(transformPost) as TPost[];
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
const searchPostByQuery = async ({ query, accessToken }: TGetPostByQuery) => {
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

type TGetPostByUserId = {
	id: string;
	limit?: number;
	accessToken: string;
};

const getPostsByUserId = async ({ id, limit, accessToken }: TGetPostByUserId) => {
	const { posts } = await getPosts({
		creator: id,
		limit,
		accessToken,
	});

	return posts;
};

// TODO: implement this in a better way
const getLikedPostsByCurrentUser = async ({ id, accessToken }: TGetPostById) => {
	const { posts } = await getPosts({
		accessToken,
	});

	return posts.filter((post) => post.likedByUser) as TPost[];
};

type TCreatePost = {
	text: string;
	file: TUploadImage;
	accessToken: string;
};

const createPost = async ({ text, file, accessToken }: TCreatePost) => {
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
	createPost,
	getPostById,
	deletePost,
	getPostsByUserId,
	getLikedPostsByCurrentUser,
	getRepliesById,
	searchPostByQuery,
};
