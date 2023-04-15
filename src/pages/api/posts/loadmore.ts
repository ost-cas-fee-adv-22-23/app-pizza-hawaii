import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { services } from '../../../services';

/**
 * @name Loadmore
 * @description
 * This api endpoint is used to get older or newer posts than the one with the given id (newerThan, olderThan).
 * It is used to load more posts when scrolling down or fetch new posts when FE need.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { newerThan, olderThan, limit } = req.query;
	const session = await getToken({ req });

	// we don't want to return more than 100 posts at a time to avoid performance and security issues
	const DEFAULT_LIMIT = 15;
	const MAX_LIMIT = 100;

	const currentLimit = Math.min(MAX_LIMIT, limit ? parseInt(limit as string, 10) : DEFAULT_LIMIT);

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	services.posts
		.getPosts({
			limit: currentLimit,
			newerThan: newerThan as string | undefined,
			olderThan: olderThan as string | undefined,
			accessToken: session?.accessToken as string,
		})
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}
