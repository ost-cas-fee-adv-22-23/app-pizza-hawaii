import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../../services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log('%creply.ts line:8 req', 'color: white; background-color: #26bfa5;', req);
	const { id } = req.query;
	const { file } = req.body;
	const { text } = req.body;
	services.posts
		.addPost({
			replyTo: id as string,
			text,
			file,
		})
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}
