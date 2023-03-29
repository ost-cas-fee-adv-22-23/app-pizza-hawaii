import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import PreloaderAnimationCard from './helpers/PreloaderAnimation';
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
	const index = [1, 2, 3, 4, 5, 6];

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
		}, 600);

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			<Grid variant="row" gap="S" marginBelow="M">
				<div className="mb-8">
					<div className="flex flex-row flex-wrap -m-2">
						{isLoading
							? index.map((i) => (
									<div key={i} className="flex-initial w-4/12 p-3">
										<PreloaderAnimationCard key={i} />
									</div>
							  ))
							: recommendedUsers.map((user) => (
									<div key={user.id} className="flex-initial w-4/12 p-3">
										<UserCard key={user.id} user={user} />
									</div>
							  ))}
					</div>
				</div>
			</Grid>
		</>
	);
};
