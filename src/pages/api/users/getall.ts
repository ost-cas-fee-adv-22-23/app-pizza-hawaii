import { NextApiRequest, NextApiResponse } from 'next';

import { usersService } from '../../../services/users';
import { getToken } from 'next-auth/jwt';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	usersService
		.getUsers({
			accessToken: id as string,
			limit: req.query?.limit as number | undefined,
		})
		.then((data) => {
			res.status(200).json({ status: true, data });
		})
		.catch((error) => {
			res.status(500).json({ status: false, error });
		});
}
