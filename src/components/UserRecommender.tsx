import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { UserCard } from './UserCard';
import { services } from '../services';

import { TUser } from '../types';
import RecommenderPreloader from './helpers/RecommenderPreloader';

type TUserRecommender = {
	currentUserId: string;
};

export const UserRecommender: FC<TUserRecommender> = ({ currentUserId }: TUserRecommender) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([] as TUser[]);
	const { data: session } = useSession();
	const accessToken = session?.accessToken;

	useEffect(() => {
		setTimeout(() => {
			if (accessToken) {
				const fetchRecommendedUsers = async () => {
					const recommendedUsers = await services.users.getUsers({
						limit: 10, // TODO: this is a workaround, because the API does not support randomization
						offset: 0,
						accessToken,
					});
					setRecommendedUsers(recommendedUsers.users);
				};
				fetchRecommendedUsers();
				setIsLoading(false);
			}
		}, 2000);
	}, [accessToken]);

	// randomize the order of the recommended users
	const randomizedRecommendedUsers = recommendedUsers.sort(() => Math.random() - 0.5);

	// exclude current user (yourself) from recommended users
	const pureRecommendedUsers = randomizedRecommendedUsers.filter((user) => user.id !== currentUserId).splice(0, 6);

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			{isLoading ? (
				<RecommenderPreloader />
			) : (
				<Grid variant="row" gap="S" marginBelow="M">
					<div className="mb-8">
						<div className="flex flex-row flex-wrap -m-2">
							{pureRecommendedUsers.map((user) => (
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
