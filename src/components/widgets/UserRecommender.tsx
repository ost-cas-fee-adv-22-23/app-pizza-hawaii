import { Headline } from '@smartive-education/pizza-hawaii';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';

import { services } from '../../services';
import { TUser } from '../../types';
import { UserCardList } from '../user/UserCardList';

/*
 * This component is used to display a list of users that the current user might want to follow or already follows.
 * We show a loading state while the data is being fetched.
 */

type TUserRecommender = {
	currentUserId: string;
	excludeUserIds?: string[];
	limit?: number;
};

export const UserRecommender: FC<TUserRecommender> = ({ currentUserId, excludeUserIds, limit = 6 }: TUserRecommender) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState<TUser[]>([]);

	const { data: session } = useSession();
	const accessToken = session?.accessToken;

	useEffect(() => {
		if (accessToken && currentUserId && limit) {
			setIsLoading(true);

			services.api.users
				.recommendations({
					currentUserId,
					excludeUserIds,
					limit,
				})
				.then((users) => {
					setRecommendedUsers(users);
					setIsLoading(false);
				})
				.catch((error) => {
					console.error(error);
					setIsLoading(false);
				});
		}
	}, [accessToken, currentUserId, excludeUserIds, limit]);

	return (
		<>
			<Headline as="h2" level={2}>
				Empfohlene User
			</Headline>
			<UserCardList users={recommendedUsers} loadingItems={isLoading ? limit : 0} />
		</>
	);
};
