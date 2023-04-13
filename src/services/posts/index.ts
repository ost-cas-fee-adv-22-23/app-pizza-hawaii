import { decodeTime } from 'ulid';

import { TPost, TRawPost, TUser } from '../../types';
import { parse as parseRichText } from '../../utils/RichText';
import { fetchItem, fetchList, TFetchBase, TFetchListResultPagination, TFetchQuery } from '../qwacker';
import { usersService } from '../users';

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

type TGetPosts = TFetchBase & TFetchQuery;

type TGetPostsResult = {
	count: number;
	posts: TPost[];
	pagination?: TFetchListResultPagination;
};

const getPosts = async (params: TGetPosts): Promise<TGetPostsResult> => {
	const { accessToken, ...searchParams } = params;

	const { count, items, pagination } = (await fetchList({
		endpoint: 'posts',
		accessToken,
		method: 'GET',
		...searchParams,
	})) as { count: number; items: TRawPost[]; pagination?: TFetchListResultPagination };

	// normalize posts
	let allPosts = items.map(transformPost) as TPost[];

	// load users
	allPosts = await addReferencesToPosts(allPosts, false, accessToken as string);

	return {
		count,
		posts: allPosts,
		pagination,
	};
};

/**
 * Get a single post by id
 *
 * @param {string} id id of the post
 * @param {string} accessToken access token of the user who is fetching the post
 * @param {string} loadReplies whether to load the replies of the post or not
 *
 */
type TGetPost = TFetchBase & {
	id: string;
	loadReplies?: boolean;
};

const getPost = async ({ id, loadReplies = false, accessToken }: TGetPost) => {
	let post = (await fetchItem({
		endpoint: `posts/${id}`,
		accessToken,
		method: 'GET',
	})) as TRawPost;

	post = transformPost(post);

	return (await addReferencesToPosts([post], loadReplies, accessToken as string))[0];
};

const deletePost = async ({ id, accessToken }: TGetPost) => {
	return await fetchItem({
		endpoint: `posts/${id}`,
		accessToken,
		method: 'DELETE',
	});
};

type TGetPostReplies = TFetchBase & {
	id: string;
};

const getPostReplies = async (params: TGetPostReplies): Promise<TGetPostsResult> => {
	const { accessToken, id } = params;

	const replies = (await fetchItem({
		endpoint: `posts/${id}/replies`,
		accessToken,
		method: 'GET',
	})) as TRawPost[];

	// normalize posts
	let allPosts = replies.map(transformPost) as TPost[];

	// load users
	allPosts = await addReferencesToPosts(allPosts, false, accessToken as string);

	// there is no count for replies so we set it to 0 for now (inconsistent API for replies)
	return {
		count: 0,
		posts: allPosts,
	};
};

type TGetPostsByQueryQuery = {
	text?: string;
	tags?: string[];
	mentions?: string[];
	isReply?: boolean;
	likedBy?: string[];

	offset?: number;
	limit?: number;
};

type TGetPostsByQuery = TFetchBase & TGetPostsByQueryQuery;

const getPostsByQuery = async (params: TGetPostsByQuery): Promise<TGetPostsResult> => {
	const { accessToken, ...searchParams } = params;

	const { count, items } = (await fetchList({
		endpoint: 'posts/search',
		accessToken,
		method: 'POST',
		...searchParams,
	})) as { count: number; items: TRawPost[] };

	// normalize posts
	let allPosts = items.map(transformPost) as TPost[];

	// load users
	allPosts = await addReferencesToPosts(allPosts, false, accessToken as string);

	return {
		count,
		posts: allPosts,
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

type TGetPostsLikedByUser = {
	id: string;
	accessToken: string;
};

const getPostsLikedByUser = async ({ id, accessToken }: TGetPostsLikedByUser) => {
	const { posts } = await getPostsByQuery({
		likedBy: [id as string],
		accessToken,
	});

	return posts;
};

type TCreatePostAttributes = {
	text: string;
	file?: File;
};

type TCreatePost = TFetchBase & {
	replyTo?: string;
	accessToken: string;
} & TCreatePostAttributes;

const createPost = async ({ replyTo, accessToken, ...postData }: TCreatePost) => {
	let url = 'posts';
	if (replyTo) {
		url = `posts/${replyTo}`;
	}

	// add postData to formData if is set (not undefined)
	const formData = new FormData();
	Object.keys(postData).forEach((key) => {
		const value = postData[key as keyof TCreatePostAttributes];
		if (value) {
			formData.append(key, value);
		}
	});

	let post = (await fetchItem({
		endpoint: url,
		accessToken,
		method: 'POST',
		body: formData,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})) as TRawPost;

	post = transformPost(post);

	return (await addReferencesToPosts([post], false, accessToken))[0];
};

const addReferencesToPosts = async (posts: TRawPost[], loadReplies = false, accessToken: string) => {
	// load users
	const userIds = posts.map((post) => post.creator);
	const users: TUser[] = [];
	if (accessToken) {
		const fetchedUsers = await usersService.getUsersByIds({
			accessToken,
			ids: userIds,
		});
		users.push(...fetchedUsers);
	}

	// add users to posts
	const fullPostsPromises = posts.map(async (post) => {
		const user = accessToken ? users.find((user) => user.id === post.creator) : usersService.emptyUser(post.creator);

		if (loadReplies) {
			const res = await getPostReplies({ id: post.id, accessToken });
			return { ...post, user, replies: res.posts || [] };
		}
		return { ...post, user };
	});

	const fullPosts = await Promise.all(fullPostsPromises);

	return fullPosts as TPost[];
};

const transformPost = (post: TRawPost) => {
	const html = parseRichText(post.text);

	return {
		...post,
		text: html,
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
