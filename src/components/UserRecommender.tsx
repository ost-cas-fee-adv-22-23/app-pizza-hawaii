import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { UserCard } from './UserCard';
import { services } from '../services';

import { TUser } from '../types';
import RecommenderPreloader from './helpers/RecommenderPreloader';
import PreloaderAnimation from './helpers/PreloaderAnimation';
import PreloaderAnimationCard from './helpers/PreloaderAnimation';

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
					const recommendedUsers = await services.api.users.recommendations({
						currentUserId,
					});
					setRecommendedUsers(recommendedUsers);
				};
				fetchRecommendedUsers();
				setIsLoading(false);
			}
		}, 2000);
	}, [accessToken, currentUserId]);

	console.log('isLoading', isLoading);

	// randomize the order of the recommended users
	// const randomizedRecommendedUsers = recommendedUsers.sort(() => Math.random() - 0.5);
	const index = [1, 2, 3, 4, 5, 6];
	// exclude current user (yourself) from recommended users
	const filteredRecommendedUsers = recommendedUsers.filter((user) => user.id !== currentUserId).splice(0, 6);
	// TODO fix the height of preloader
	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			<Grid variant="row" gap="S" marginBelow="M">
				<div className="mb-8">
					<div className="flex flex-row flex-wrap -m-2">
						{isLoading
							? index.map((i) => <PreloaderAnimationCard key={i} />)
							: filteredRecommendedUsers.map((user) => (
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
