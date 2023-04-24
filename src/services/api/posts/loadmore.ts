import { TPost } from '../../../types';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TLoadmoreResult = {
	count: number;
	posts: TPost[];
};

export type TLoadmore = {
	olderThan?: string;
	newerThan?: string;
	creator?: string;
};

/**
 * Get a few posts that are older or newer than a given post id
 *
 * @param {string} olderThan - Get posts older than this id
 * @param {string} newerThan - Get posts newer than this id
 * @param {string} creator - Get posts by this creator
 *
 * @returns {Promise<TLoadmoreResult>}
 */

export const loadmore = async ({ olderThan, newerThan, creator }: TLoadmore): Promise<TLoadmoreResult> => {
	// create url params
	const urlParams = new URLSearchParams();

	if (olderThan !== undefined) {
		urlParams.set('olderThan', olderThan);
	}

	if (newerThan !== undefined) {
		urlParams.set('newerThan', newerThan);
	}

	if (creator !== undefined) {
		urlParams.set('creator', creator);
	}

	const res = await fetch(`${BASE_URL}/api/posts/loadmore?${urlParams}`);
	return (await res.json()) as TLoadmoreResult;
};
