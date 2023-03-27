import { TUserSimple } from '../../../types';

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
	const res = await fetch(`/api/users/recommendations`, {
		method: 'POST',
		body: JSON.stringify({
			currentUserId,
			excludeUserIds,
			limit,
		}),
	});

	return (await res.json()) as TUserSimple[];
};
