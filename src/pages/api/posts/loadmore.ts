import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { services } from '../../../services';

/**
 * @name Loadmore
 * @description
 * This api endpoint is used to get posts from the API.
 * The two parameters `newerThan` and `olderThan` are used to fetch posts before or after a specific postID or ULID date.
 * The parameter `limit` is used to limit the number of posts returned. The default is 15 and the maximum is 100.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { newerThan, olderThan, limit, ...rest } = req.query;
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

	try {
		const result = await services.posts.getPosts({
			...rest,
			limit: currentLimit,
			newerThan: newerThan as string | undefined,
			olderThan: olderThan as string | undefined,
			accessToken: session?.accessToken as string,
		});

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({
			status: false,
			error: error,
		});
	}
}
