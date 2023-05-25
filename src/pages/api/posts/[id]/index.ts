import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { services } from '../../../../services';

const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const method = req.method;

	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	switch (method) {
		case HTTP_METHODS.GET:
			try {
				const post = await services.posts.getPost({
					id: req.query.id as string,
					accessToken: session?.accessToken as string,
				});
				res.status(200).json(post);
			} catch (err) {
				res.status(500).json(err);
			}
			break;

		case HTTP_METHODS.DELETE:
			try {
				const post = await services.posts.deletePost({
					id: req.query.id as string,
					accessToken: session?.accessToken as string,
				});
				res.status(200).json(post);
			} catch (err) {
				res.status(500).json(err);
			}

			break;

		default:
			res.setHeader('Allow', [HTTP_METHODS.GET, HTTP_METHODS.DELETE]);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}
