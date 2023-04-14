import { TUserSimple } from '../../../types';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TRecommendations = {
	currentUserId: string;
	excludeUserIds?: string[];
	limit?: number;
};

/**
 * Get a list of recommended users
 * @param {string} currentUserId
 * @param {string[]} excludeUserIds
 * @param {number} limit
 * @returns {Promise<TUserSimple[]>}
 */

export const recommendations = async ({
	currentUserId,
	excludeUserIds,
	limit,
}: TRecommendations): Promise<TUserSimple[]> => {
	const res = await fetch(`${BASE_URL}/api/users/recommendations`, {
		method: 'POST',
		body: JSON.stringify({
			currentUserId,
			excludeUserIds,
			limit,
		}),
	});

	return (await res.json()) as TUserSimple[];
};
