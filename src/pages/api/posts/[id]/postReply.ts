import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../../services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	services.posts
		.postReply({
			id: id as string,
		})
		.then((mumble) => {
			res.status(200).json(mumble);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}
