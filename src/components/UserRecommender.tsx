import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { UserCardSkeleton } from './helpers/UserCardSkeleton';
import { UserCard } from './UserCard';
import { services } from '../services';

import { TUser } from '../types';

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
		// Todo: This is rendered to often, Why?
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

	if (!isLoading && !recommendedUsers?.length) return null;

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			<Grid variant="row" gap="S" marginBelow="M">
				<div className="mb-8">
					<div className="flex flex-row flex-wrap -m-2">
						{isLoading
							? Array.from(Array(limit).keys()).map((i) => (
									<div key={i} className="flex-initial w-4/12 p-2">
										<UserCardSkeleton key={i} />
									</div>
							  ))
							: recommendedUsers.map((user) => (
									<div key={user.id} className="flex-initial w-4/12 p-2">
										<UserCard key={user.id} user={user} />
									</div>
							  ))}
					</div>
				</div>
			</Grid>
		</>
	);
};
