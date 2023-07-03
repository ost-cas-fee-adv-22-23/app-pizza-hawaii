import { TZitadelUser } from '../../../types/Zitadel';

/**
 * Get user profile of current user
 * @returns {Promise<ZitadelProfile>}
 */

export const get = async (): Promise<TZitadelUser> => {
	const res = await fetch(`/api/profile`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch user profile: ${res.statusText}`);
	}

	return (await res.json()) as TZitadelUser;
};

export const update = async (userProfile: TZitadelUser): Promise<Response> => {
	return await fetch(`/api/profile`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userProfile),
	});
};

export const register = async (userProfile: TZitadelUser): Promise<Response> => {
	return await fetch(`/api/profile`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userProfile),
	});
};
