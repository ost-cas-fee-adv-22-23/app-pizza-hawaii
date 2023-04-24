import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { TZitadelEmail, TZitadelProfile } from '../../../types/Zitadel';

type TFetchProfile<T> = {
	accessToken: string;
	method?: 'GET' | 'PUT';
	endpoint?: 'profile' | 'email' | 'username';
	body?: T;
};

const fetchUserData = async <T>({
	accessToken,
	method,
	endpoint,
	body,
}: TFetchProfile<T>): Promise<T | { error: string }> => {
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
		return { error: data.message || `Something went wrong for ${endpoint}!` };
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

type TRegisterUser = {
	accessToken: string;
	body: TZitadelUser;
};
const registerUser = async <TZitadelUser>({ accessToken, body }: TRegisterUser) => {
	const response = await fetch(`${process.env.ZITADEL_ISSUER}/users/human/_import`, {
		headers: {
			//'x-zitadel-orgid': `${process.env.ZITADEL_ORG_ID}`,
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
			accept: 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		return { error: `Something went wrong for register user!` };
	}

	const data = await response.json();
	if (!response.ok) {
		return { error: data.message || `Something went wrong for register user!` };
	}

	return data as Promise<unknown>;
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
			// disable username for now as it returns error from zitadel
			// if (req.body.userName) {
			// 	const response = await setUserData<TZitadelUserName & { error: string }>({
			// 		endpoint: 'username',
			// 		accessToken: token.accessToken,
			// 		body: req.body.userName,
			// 	});

			// 	data = {
			// 		...data,
			// 		username: response,
			// 	};
			// }
			if (req.body.profile) {
				const response = await setUserData<TZitadelProfile & { error: string }>({
					endpoint: 'profile',
					accessToken: token.accessToken,
					body: req.body.profile,
				});

				data = {
					...data,
					profile: response,
				};
			}
			if (req.body.email) {
				const response = await setUserData<TZitadelEmail & { error: string }>({
					endpoint: 'email',
					accessToken: token.accessToken,
					body: req.body.email,
				});

				data = {
					...data,
					email: response,
				};
			}
			// check if there was an error
			if (Object.values(data).some((value) => (value as { error: string })?.error)) {
				const errorData = Object.entries(data).reduce((acc, [key, value]) => {
					if ((value as { error: string })?.error) {
						acc[key] = (value as { error: string }).error;
					}
					return acc;
				}, {} as { [key: string]: string });

				return res.status(500).json({ status: false, errors: errorData });
			}

			return res.status(200).json({ status: true });

			break;

		case 'POST':
			await registerUser<TZitadelUser>({
				accessToken: token.accessToken,
				body: req.body,
			});
			break;
		default:
			return res.status(405).end();
	}

	return res.status(200).json(data);
};

export default handler;
