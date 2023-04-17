import { TUserSimple } from '../../../types';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TUsers = {
	userIds: string[];
};

/**
 * Get a list of users
 * @param {string[]} userIds
 * @returns {Promise<TUserSimple[]>}
 */

export const users = async ({ userIds }: TUsers): Promise<TUserSimple[]> => {
	const res = await fetch(`${BASE_URL}/api/users`, {
		method: 'POST',
		body: JSON.stringify({
			userIds,
		}),
	});

	return (await res.json()) as TUserSimple[];
};
