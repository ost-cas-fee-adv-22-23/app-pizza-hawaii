import { TPost } from '../../../types';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TGetPostResult = {
	count: number;
	posts: TPost[];
};

type TGetPost = {
	olderThan?: string;
	newerThan?: string;
};

/**
 * Get a few posts that are older or newer than a given post id
 *
 * @param {string} olderThan - Get posts older than this id
 * @param {string} newerThan - Get posts newer than this id
 *
 * @returns {Promise<TGetPostResult>}
 */

export const loadmore = async ({ olderThan, newerThan }: TGetPost): Promise<TGetPostResult> => {
	// create url params
	const urlParams = new URLSearchParams();

	if (olderThan !== undefined) {
		urlParams.set('olderThan', olderThan);
	}

	if (newerThan !== undefined) {
		urlParams.set('newerThan', newerThan);
	}

	const res = await fetch(`${BASE_URL}/api/posts/loadmore?${urlParams}`);
	return (await res.json()) as TGetPostResult;
};
