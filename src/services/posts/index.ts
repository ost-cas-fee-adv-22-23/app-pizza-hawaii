import { decodeTime } from 'ulid';
import { TPost } from '../../types';
import fetchQwackerApi from '../qwacker';

import { usersService } from '../users';

const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};

type TUploadImage = File & { preview: string };
type TRawPost = Omit<TPost, 'createdAt, user, replies'>;

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

	const result = (await fetchQwackerApi(`posts?${urlParams}`, accessToken, {
		method: 'GET',
	})) as { count: number; data: TRawPost[] };

	let remainingCount = result.count;
	const lastPostId = result.data[result.data.length - 1]?.id as string;
	let posts = result.data.map(transformPost) as TPost[];

	// If there are more entries to fetch, make a recursive call
	if (remainingCount > 0 && (!limit || posts.length < limit)) {
		const remainingLimit = limit && remainingCount > limit ? limit - posts.length : remainingCount;

		const result = await getPosts({
			...params,
			limit: remainingLimit,
			olderThan: lastPostId,
			accessToken,
		});

		remainingCount = result.count;
		posts = [...posts, ...result.posts];
	}

	// normalize posts
	posts = posts.map(transformPost) as TPost[];

	// load users
	posts = await addReferencesToPosts(posts, false, accessToken);

	return {
		count: remainingCount,
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
	loadReplies?: boolean;
};

const getPost = async ({ id, loadReplies = false, accessToken }: TGetPost) => {
	let post = (await fetchQwackerApi(`posts/${id}`, accessToken, {
		method: 'GET',
	})) as TRawPost;

	post = transformPost(post);

	return (await addReferencesToPosts([post], loadReplies, accessToken))[0];
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

const getPostReplies = async ({ id, accessToken }: TGetPost) => {
	let posts = (await fetchQwackerApi(`posts/${id}/replies`, accessToken)) as TRawPost[];

	posts = posts.map(transformPost) as TPost[];
	posts = await addReferencesToPosts(posts, false, accessToken);

	return posts;
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
		posts: await addReferencesToPosts(posts, false, accessToken),
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
	console.log(posts);
	return posts;
};

type TCreatePost = {
	text: string;
	file: TUploadImage;
	replyTo?: string;
	accessToken: string;
};

// direct to db
const createPost = async ({ formData, replyTo, accessToken }: TCreatePost) => {
	let url = 'posts';
	if (replyTo) {
		url = `posts/${replyTo}`;
	}
	console.log('url from createPost', url);
	console.log('url from createPost', formData);
	let post = (await fetchQwackerApi(url, accessToken, {
		method: 'POST',
		body: formData,
	})) as TRawPost;
	console.log('post from createPost', post);
	post = transformPost(post);
	return (await addReferencesToPosts([post], false, accessToken))[0];
};

const addReferencesToPosts = async (posts: TRawPost[], loadReplies = false, accessToken: string) => {
	// load users
	const userIds = posts.map((post) => post.creator);
	const users = await usersService.getUsersByIds({ ids: userIds, accessToken });

	// add users to posts
	const fullPostsPromises = posts.map(async (post) => {
		const user = users.find((user) => user.id === post.creator) as TPost['user'];
		if (loadReplies) {
			const replies = await getPostReplies({ id: post.id, accessToken });
			return { ...post, user, replies };
		}
		return { ...post, user };
	});

	const fullPosts = await Promise.all(fullPostsPromises);

	return fullPosts;
};
const transformPost = (post: TRawPost) => {
	return {
		...post,
		createdAt: new Date(decodeTime(post.id)).toISOString(),
	};
};

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
