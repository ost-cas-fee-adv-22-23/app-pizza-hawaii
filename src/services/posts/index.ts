import { decodeTime } from 'ulid';

import { TPost, TRawPost, TUser } from '../../types';
import { parse as parseRichText } from '../../utils/RichText';
import { fetchItem, fetchList, TFetchBase, TFetchListResultPagination, TFetchQuery } from '../qwacker';
import { usersService } from '../users';

/**
 *
 * ============== Get a list of posts ==============
 *
 */

type TGetPosts = TFetchBase & TFetchQuery;

type TGetPostsResult = {
	count: number;
	posts: TPost[];
	pagination?: TFetchListResultPagination;
};

/**
 * Get a list of posts
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
 *
 * ============== Single post actions ==============
 *
 */

type TGetPost = TFetchBase & {
	id: string;
	loadReplies?: boolean;
};

/**
 * Get a single post
 *
 * @param {string} id id of the post
 * @param {string} accessToken access token of the user who is fetching the post
 * @param {string} loadReplies whether to load the replies of the post or not
 *
 */

const getPost = async ({ id, loadReplies = false, accessToken }: TGetPost) => {
	let post = (await fetchItem({
		endpoint: `posts/${id}`,
		accessToken,
		method: 'GET',
	})) as TRawPost;

	post = transformPost(post);

	return (await addReferencesToPosts([post], loadReplies, accessToken as string))[0];
};

/**
 *
 * ============== Get a list of replies to a post ==============
 *
 */

type TGetPostReplies = TFetchBase & {
	id: string;
};

/**
 * Get a list of replies to a post
 * @param {string} id id of the post
 * @param {string} accessToken access token of the user who is fetching the post
 * @returns {Promise<{ count: number; users: TPost[] }>}
 */

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

/**
 *
 * ============== Get a list of replies to a post ==============
 *
 */

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

/**
 * Get a list of posts by query
 *
 * @param {string} text text to search for
 * @param {string[]} tags tags to search for
 * @param {string[]} mentions mentions to search for
 * @param {boolean} isReply whether to search for replies or not
 * @param {string} likedBy id of the user who liked the post
 * @param {number} offset default 0
 * @param {number} limit default 10
 * @param {string} accessToken access token of the user who is fetching the posts
 *
 * @returns {Promise<{ count: number; users: TPost[] }>}
 */

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

/**
 *
 * ============== Get posts of a user ==============
 *
 */

type TGetPostByUserId = {
	id: string;
	limit?: number;
	accessToken: string;
};

/**
 * Get posts of a user
 * @param {string} id id of the user
 * @param {number} limit limit of posts to fetch
 * @param {string} accessToken access token of the user who is fetching the posts
 * @returns {Promise<TPost[]>}
 */

const getPostsOfUser = async ({ id, limit, accessToken }: TGetPostByUserId) => {
	const { posts } = await getPosts({
		creator: id,
		limit,
		accessToken,
	});

	return posts;
};

/**
 *
 * ============== Get posts liked by a user ==============
 *
 */

type TGetPostsLikedByUser = {
	id: string;
	accessToken: string;
};

/**
 * Get posts liked by a user
 * @param {string} id id of the user
 * @param {string} accessToken access token of the user who is fetching the posts
 * @returns {Promise<TPost[]>}
 */

const getPostsLikedByUser = async ({ id, accessToken }: TGetPostsLikedByUser) => {
	const { posts } = await getPostsByQuery({
		likedBy: [id as string],
		accessToken,
	});

	return posts;
};

/**
 *
 * ============== Create a post or a reply ==============
 *
 */

type TCreatePostAttributes = {
	text: string;
	file?: File;
};

type TCreatePost = TFetchBase & {
	replyTo?: string;
	accessToken: string;
} & TCreatePostAttributes;

/**
 * Create a post or a reply
 * @param {string} replyTo id of the post to reply to
 * @param {string} accessToken access token of the user who is creating the post
 * @param {string} text text of the post
 * @param {File} file file to upload
 */

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

/**
 *
 * ============== Delete a post ==============
 *
 */

/**
 * Delete a post
 * @param {string} id id of the post
 * @param {string} accessToken access token of the user who is deleting the post
 * @returns {Promise<void>}
 */

const deletePost = async ({ id, accessToken }: TGetPost) => {
	return await fetchItem({
		endpoint: `posts/${id}`,
		accessToken,
		method: 'DELETE',
	});
};

/**
 *
 * ============== Add references to posts ==============
 *
 */

/**
 * Add references to posts (users and optional replies)
 * @param {TRawPost[]} posts posts to add references to
 * @param {boolean} loadReplies whether to load the replies of the post or not
 * @param {string} accessToken access token of the user who is fetching the post
 * @returns {Promise<TPost[]>}
 */

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

/**
 *
 * ============== HELPERS ==============
 *
 */

// transform raw post to post by parsing the rich text and adding createdAt date
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
