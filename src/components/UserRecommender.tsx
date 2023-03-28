import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import PreloaderAnimationCard from './helpers/PreloaderAnimation';
import { UserCard } from './UserCard';
import { services } from '../services';

import { TUser } from '../types';

type TUserRecommender = {
	currentUserId: string;
};

export const UserRecommender: FC<TUserRecommender> = ({ currentUserId }: TUserRecommender) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([] as TUser[]);
	const { data: session } = useSession();
	const accessToken = session?.accessToken;
	const index = [1, 2, 3, 4, 5, 6];

	useEffect(() => {
		setTimeout(() => {
			if (accessToken) {
				const fetchRecommendedUsers = async () => {
					const recommendedUsers = await services.api.users.recommendations({
						currentUserId,
					});
					setRecommendedUsers(recommendedUsers);
					setIsLoading(false);
				};
				fetchRecommendedUsers();
			}
		}, 600);
	}, [accessToken, currentUserId]);

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
