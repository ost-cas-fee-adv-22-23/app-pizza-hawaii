import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { UserCard } from './UserCard';
import { services } from '../services';

import { TUser } from '../types';

type TUserRecommender = {
	currentUserId: string;
	excludeUserIds?: string[];
	limit?: number;
};

export const UserRecommender: FC<TUserRecommender> = ({ currentUserId, excludeUserIds, limit = 6 }: TUserRecommender) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([] as TUser[]);
	const { data: session } = useSession();
	const accessToken = session?.accessToken;

	// TODO: this useEffect is called twice, why?
	useEffect(() => {
		if (accessToken && currentUserId && limit) {
			setIsLoading(true);
			const fetchRecommendedUsers = async () => {
				const recommendedUsers = await services.api.users.recommendations({
					currentUserId,
					excludeUserIds,
					limit,
				});
				setRecommendedUsers(recommendedUsers);
			};
			fetchRecommendedUsers();
			setIsLoading(false);
		}
	}, [accessToken, currentUserId, excludeUserIds, limit]);

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Grid variant="row" gap="S" marginBelow="M">
					<div className="mb-8">
						<div className="flex flex-row flex-wrap -m-2">
							{recommendedUsers.map((user) => (
								<div key={user.id} className="flex-initial w-4/12 p-3">
									<UserCard key={user.id} user={user} />
								</div>
							))}
						</div>
					</div>
				</Grid>
			)}
		</>
	);
};
