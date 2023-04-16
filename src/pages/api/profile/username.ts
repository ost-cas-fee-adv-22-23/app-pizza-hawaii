import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const endpoint = `${process.env.ZITADEL_ISSUER}/auth/v1/users/me/username`;

	const token = await getToken({ req });
	if (!token?.accessToken) {
		return res.status(401).end();
	}

	// create body for request if PUT
	let body = undefined;

	if (req.method === 'PUT') {
		const { userName } = req.body;
		body = JSON.stringify({
			userName,
		});
	}

	const response = await fetch(endpoint, {
		headers: {
			authorization: `Bearer ${token.accessToken}`,
			'content-type': 'application/json',
		},
		method: req.method,
		body,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Something went wrong!');
	}

	return res.status(200).json(data);
};

export default handler;
