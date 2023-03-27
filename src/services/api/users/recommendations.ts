import { TUserSimple } from '../../../types';

type TRecommendations = {
	currentUserId: string;
	excludeUserIds?: string[];
};

export const recommendations = async ({ currentUserId, excludeUserIds }: TRecommendations): Promise<TUserSimple[]> => {
	const formData = new FormData();
	formData.append('currentUserId', currentUserId);

	if (excludeUserIds) {
		formData.append('excludeUserIds', excludeUserIds.join(','));
	}

	const res = await fetch(`/api/users/recommendations`, {
		method: 'POST',
		body: formData,
	});

	return (await res.json()) as TUserSimple[];
};