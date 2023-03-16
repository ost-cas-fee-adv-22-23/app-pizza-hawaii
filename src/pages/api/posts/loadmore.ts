import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../services';
import { getToken } from 'next-auth/jwt';

/**
 * @name Loadmore
 * @description
 * This api endpoint is used to get older or newer posts than the one with the given id (newerThan, olderThan).
 * It is used to load more posts when scrolling down or fetch new posts when FE need.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { newerThan, olderThan } = req.query;
	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	services.posts
		.getPosts({
			limit: 10, // limit is hardcoded so nobody can request more than 10 posts via the api
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
