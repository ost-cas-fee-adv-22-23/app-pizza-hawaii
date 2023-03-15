import { decodeTime } from 'ulid';
import { TPost } from '../../types';
import fetchQwackerApi from '../qwacker';

const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

type TUploadImage = File & { preview: string };
type TRawPost = Omit<TPost, 'createdAt'>;

type TBase = {
	accessToken: string;
};

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

type TGetPosts = TBase & {
	newerThan?: string;
	olderThan?: string;
	limit?: number;
	offset?: number;
	creator?: string;
};

type TGetPostsResult = {
	count: number;
	posts: TPost[];
};

const getPosts = async (params: TGetPosts): Promise<TGetPostsResult> => {
	const maxLimit = 1000;
	const { newerThan, olderThan, limit, offset, creator, accessToken }: TGetPosts = params;

	// create url params
	const urlParams = new URLSearchParams();

	if (offset !== undefined) {
		urlParams.set('offset', offset.toString());
	}
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

	const { count, data } = (await fetchQwackerApi(`posts?${urlParams}`, accessToken, {
		method: 'GET',
	})) as { count: number; data: TRawPost[] };

	const lastPostId = data[data.length - 1]?.id as string;
	const posts = data.map(transformPost) as TPost[];

	// If there are more entries to fetch, make a recursive call
	if (count > 0 && (!limit || posts.length < limit)) {
		const remainingLimit = limit && count > limit ? limit - posts.length : count;
		const { posts: remainingPosts, count: remainingCount } = await getPosts({
			...params,
			limit: remainingLimit,
			olderThan: lastPostId,
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
 */
type TGetPost = TBase & {
	id: string;
};

const getPost = async ({ id, accessToken }: TGetPost) => {
	const post = (await fetchQwackerApi(`posts/${id}`, accessToken, {
		method: 'GET',
	})) as TRawPost;

	return transformPost(post);
};

const deletePost = async ({ id, accessToken }: TGetPost) => {
	const res = await fetchQwackerApi(`posts/${id}`, accessToken, {
		method: 'DELETE',
	});

	if (res.status !== 204) {
		console.error(statusMessageMap[res.status]);
		return false;
	}

	return true;
};

const getPostReplies = async ({ id }: TGetPost) => {
	const posts = (await fetchQwackerApi(`posts/${id}/replies`)) as TRawPost[];

	return posts.map(transformPost) as TPost[];
};

type TGetPostQueryObj = {
	text?: string;
	tags?: string[];
	mentions?: string[];
	isReply?: boolean;
	offset?: number;
	limit?: number;
	likedBy?: string[];
};

type TGetPostByQuery = {
	query: TGetPostQueryObj;
	accessToken: string;
};

// search for posts by a search object
const getPostsByQuery = async ({ query, accessToken }: TGetPostByQuery) => {
	const { count, data } = (await fetchQwackerApi(`posts/search`, accessToken, {
		method: 'POST',
		body: JSON.stringify(query),
	})) as { count: number; data: TRawPost[] };

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

const getPostsOfUser = async ({ id, limit, accessToken }: TGetPostByUserId) => {
	const { posts } = await getPosts({
		creator: id,
		limit,
		accessToken,
	});

	return posts;
};
type TgetPostsLikedByUser = {
	id: string;
	accessToken: string;
};

// TODO: implement this in a better way
const getPostsLikedByUser = async ({ id, accessToken }: TgetPostsLikedByUser) => {
	const { posts } = await getPostsByQuery({
		query: {
			likedBy: [id],
		},
		accessToken,
	});

	return posts;
};

type TCreatePost = {
	text: string;
	file: TUploadImage;
	accessToken: string;
};

const createPost = async ({ text, file, accessToken }: TCreatePost) => {
	const formData = new FormData();
	formData.append('text', text);
	if (file) {
		formData.append('image', file);
	}

	const post = (await fetchQwackerApi(`posts`, accessToken, {
		method: 'POST',
		body: formData,
	})) as TRawPost;

	return transformPost(post);
};

const transformPost = (post: TRawPost) => ({
	...post,
	createdAt: new Date(decodeTime(post.id)).toISOString(),
});

export const postsService = {
	getPosts,
	getPost,
	createPost,
	deletePost,
	getPostsOfUser,
	getPostsLikedByUser,
	getPostReplies,
	getPostsByQuery,
};
