import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { TZitadelEmail, TZitadelProfile, TZitadelUser, TZitadelUserName } from '../../../types/Zitadel';

type TFetchProfile<T> = {
	accessToken: string;
	method?: 'GET' | 'PUT';
	endpoint?: 'profile' | 'email' | 'username';
	body?: T;
};

const fetchUserData = async <T>({ accessToken, method, endpoint, body }: TFetchProfile<T>): Promise<T> => {
	const url = `${process.env.ZITADEL_ISSUER}/auth/v1/users/me${endpoint ? `/${endpoint}` : ''}`;

	const response = await fetch(url, {
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
		throw new Error(data.message || `Something went wrong for ${endpoint}!`);
	}

	return endpoint
		? data[endpoint]
		: {
				userName: data.user?.userName,
				...data.user?.human,
		  };
};

const getUserData = async <T>(props: TFetchProfile<T>) => {
	return fetchUserData({ ...props, method: 'GET' }) as Promise<T>;
};

const setUserData = async <T>(props: TFetchProfile<T>) => {
	const currentData = await getUserData<T>(props);

	if (!dataChanged(currentData as object, props.body as object)) {
		return;
	}

	return fetchUserData({ ...props, method: 'PUT' }) as Promise<T>;
};

const dataChanged = (currentData: object, newData: object) => {
	if (typeof currentData === 'string' || typeof newData === 'string') {
		return currentData !== newData;
	}

	const changed = Object.keys(newData).some((key) => {
		return (
			JSON.stringify((currentData as Record<string, unknown>)[key]) !==
			JSON.stringify((newData as Record<string, unknown>)[key])
		);
	});

	return changed;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req });

	if (!token?.accessToken) {
		return res.status(401).end();
	}

	const { method } = req;

	let data = {};
	switch (method) {
		case 'GET':
			data = await getUserData<TZitadelUser>({
				accessToken: token.accessToken,
			});
			break;
		case 'PUT':
			// if (req.body.userName) {
			// 	await setUserData<TZitadelUserName>({
			// 		endpoint: 'username',
			// 		accessToken: token.accessToken,
			// 		body: req.body.userName,
			// 	});
			// }
			if (req.body.profile) {
				await setUserData<TZitadelProfile>({
					endpoint: 'profile',
					accessToken: token.accessToken,
					body: req.body.profile,
				});
			}
			if (req.body.email) {
				await setUserData<TZitadelEmail>({
					endpoint: 'email',
					accessToken: token.accessToken,
					body: req.body.email,
				});
			}
			break;
		default:
			return res.status(405).end();
	}

	return res.status(200).json(data);
};

export default handler;
