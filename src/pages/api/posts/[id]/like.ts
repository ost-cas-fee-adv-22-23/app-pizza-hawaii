import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../../services';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const session = await getToken({ req });

	if (!session) {
		return res.status(500).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}
	console.log(session?.accessToken);
	services.likes
		.like({
			id: id as string,
			accessToken: session?.accessToken as string,
		})
		.then(() => {
			res.status(200).json({ status: true });
		})
		.catch((err) => {
			res.status(500).json({ status: false, error: err });
		});
}
