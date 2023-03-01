import { NextApiRequest, NextApiResponse } from 'next';

import { services } from '../../../../services';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const session = await getToken({ req });

	services.likes
		.unlike({
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
