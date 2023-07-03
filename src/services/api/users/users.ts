import { TUserSimple } from '../../../types';

type TUsers = {
	userIds: string[];
};

/**
 * Get a list of users
 * @param {string[]} userIds
 * @returns {Promise<TUserSimple[]>}
 */

export const users = async ({ userIds }: TUsers): Promise<TUserSimple[]> => {
	const res = await fetch(`/api/users`, {
		method: 'POST',
		body: JSON.stringify({
			userIds,
		}),
	});

	return (await res.json()) as TUserSimple[];
};
