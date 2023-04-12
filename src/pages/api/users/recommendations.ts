import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { services } from '../../../services';

/**
 * @name UserRecommendations
 * @description
 * This api endpoint to get recommended users for the current user.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body);
	const { currentUserId } = body;

	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	if (!currentUserId) {
		return res.status(400).json({
			status: false,
			error: `The currentUserId is required.`,
		});
	}

	/**
	 *  This is a simple implementation of a recommendation system. It is not perfect and can be improved.
	 *  The idea is to get the newest users and then randomize the order of the users.
	 *  The current user is excluded from the recommended users.
	 *  The users that the current user has already followed or blocked could also excluded from the recommended users.
	 *  The number of recommended users is limited to 42.
	 */

	// add the current user id to the list of excluded users
	let excludeUserIds: string[] = [currentUserId as string];

	// add the user ids from the request body to the list of excluded users
	if (req.query?.excludeUserIds && Array.isArray(body.excludeUserIds)) {
		excludeUserIds = [excludeUserIds, ...body.excludeUserIds].flat();
	}

	services.users
		.getUsers({
			limit: 100, // uses the newest 100 users as a pool of recommended users (good enough for now)
			accessToken: session?.accessToken as string,
		})
		.then((result) => {
			// randomize the order of the recommended users
			let randomizedRecommendedUsers = result.users.sort(() => Math.random() - 0.5);

			// exclude all users from the excludeUserIds list
			randomizedRecommendedUsers = randomizedRecommendedUsers.filter((user) => {
				return !excludeUserIds.includes(user.id);
			});

			// limit the number of recommended users, max 42, min 6 or the limit from body.limit
			const limit = Math.min(Math.max(body.limit || 6, 6), 42);

			// limit the number of recommended users to disguise our user numbers from the public
			randomizedRecommendedUsers = randomizedRecommendedUsers.splice(0, limit);

			// return only the necessary information to the client to protect our data from being exposed to the public via API
			randomizedRecommendedUsers = randomizedRecommendedUsers.map((user) => {
				return services.users.reducedUserInformation(user);
			});

			res.status(200).json(randomizedRecommendedUsers);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}
