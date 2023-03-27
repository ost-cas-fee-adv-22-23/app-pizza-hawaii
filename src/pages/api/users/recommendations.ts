import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../services';
import { getToken } from 'next-auth/jwt';

/**
 * @name UserRecommendations
 * @description
 * This api endpoint to get recommended users for the current user.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { currentUserId } = req.query;

	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	// This is a simple implementation of a recommendation system. It is not perfect and can be improved.
	services.users
		.getUsers({
			limit: 100, // uses the newest 100 users as a pool of recommended users (good enough for now)
			accessToken: session?.accessToken as string,
		})
		.then((result) => {
			// randomize the order of the recommended users
			let randomizedRecommendedUsers = result.users.sort(() => Math.random() - 0.5);

			// exclude current user from recommended user list
			randomizedRecommendedUsers = randomizedRecommendedUsers.filter((user) => user.id !== currentUserId);

			// return only 6 users to disguise our user numbers from the public
			randomizedRecommendedUsers = randomizedRecommendedUsers.splice(0, 6);

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
