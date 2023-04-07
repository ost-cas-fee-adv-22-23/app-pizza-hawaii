import { TUserSimple } from '../../../types';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TRecommendations = {
	currentUserId: string;
	excludeUserIds?: string[];
	limit?: number;
};

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
