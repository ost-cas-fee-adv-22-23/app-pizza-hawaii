import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TZitadelProfile } from '../../../types/Zitadel';

type TFetchProfile = {
	accessToken: string;
	user?: string;
	method?: 'GET' | 'PUT';
	body?: TZitadelProfile;
};

const fetchProfileData = async ({
	user = 'me',
	accessToken,
	method = 'GET',
	...body
}: TFetchProfile): Promise<TZitadelProfile> => {
	const endpoint = `${process.env.ZITADEL_ISSUER}/auth/v1/users/${user}/profile`;

	const response = await fetch(endpoint, {
		headers: {
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
			accept: 'application/json',
		},
		method,
		body: method === 'PUT' ? JSON.stringify(body) : undefined,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Something went wrong!');
	}

	return data.profile;
};

const getProfileData = async ({ user = 'me', accessToken }: TFetchProfile) => {
	return fetchProfileData({ user, accessToken });
};

const setProfileData = async ({ user = 'me', accessToken, ...body }: TFetchProfile) => {
	return fetchProfileData({ user, accessToken, method: 'PUT', ...body });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req });
	if (!token?.accessToken) {
		return res.status(401).end();
	}

	const { method } = req;

	const currentProfileData = await getProfileData({ accessToken: token.accessToken });
	let data;
	console.log('currentProfileData', currentProfileData);
	switch (method) {
		case 'GET':
			data = currentProfileData;
			break;
		case 'PUT':
			data = await setProfileData({
				accessToken: token.accessToken,
				...{
					...currentProfileData,
					...req.body,
				},
			});
			break;
		default:
			return res.status(405).end();
	}

	return res.status(200).json(data);
};

export default handler;
