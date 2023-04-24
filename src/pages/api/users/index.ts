import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { services } from '../../../services';

/**
 * @name Users
 * @description
 * This api endpoint to get users by ID.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body);
	const { userIds } = body;

	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	if (!userIds) {
		return res.status(400).json({
			status: false,
			error: `The request body is missing the userIds property.`,
		});
	}

	if (!Array.isArray(userIds)) {
		return res.status(400).json({
			status: false,
			error: `The request body's userIds property is not an array.`,
		});
	}

	try {
		const result = await services.users.getUsersByIds({
			ids: userIds,
			accessToken: session?.accessToken as string,
		});

		if (!result) {
			return res.status(404).json({
				status: false,
				error: `The users with the IDs ${userIds.join(', ')} could not be found.`,
			});
		}

		const users = result.map((user) => {
			return services.users.reducedUserInformation(user);
		});

		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
}
