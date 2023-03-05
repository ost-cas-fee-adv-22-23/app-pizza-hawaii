import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../../services';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const session = await getToken({ req });

	services.posts
		.getPostById({
			id: id as string,
			accessToken: session?.accessToken as string,
		})
		.then((mumble) => {
			res.status(200).json(mumble);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}
