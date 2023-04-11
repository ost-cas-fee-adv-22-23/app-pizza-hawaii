import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let endpoint = `${process.env.ZITADEL_ISSUER}/auth/v1/users/201174859663802625/metadata`;

	console.log(111111111);

	const token = await getToken({ req });
	if (!token?.accessToken) {
		return res.status(401).end();
	}

	const key = req.query.key;
	console.log(55555555, key);

	if (key === undefined) {
		return res.status(400).end();
	}

	endpoint = `${endpoint}/${key}`;

	console.log(endpoint);

	// create body for request if PUT
	let body = undefined;

	if (req.method === 'POST') {
		const { value } = req.body;
		console.log(key, value);
		body = JSON.stringify({
			value: value,
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
