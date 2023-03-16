import React, { FC, useEffect, useState } from 'react';
import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { services } from '../services';
import { useSession } from 'next-auth/react';
import { UserCard } from './UserCard';
import { TUser } from '../types';

interface TUserRecommender {
	currentUserId: string;
}

export const UserRecommender: FC<TUserRecommender> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([] as TUser[]);
	const { data: session } = useSession();
	const { currentUserId } = props;
	const accessToken = session?.accessToken;

	// its clientside and its working better IMHO
	useEffect(() => {
		if (accessToken) {
			const fetchRecommendedUsers = async (accessToken: string) => {
				const recommendedUsers = await services.users.getUsers({
					limit: 7,
					offset: 0,
					accessToken,
				});
				setRecommendedUsers(recommendedUsers.users);
			};
			fetchRecommendedUsers(accessToken);
			setIsLoading(false);
		}
	}, [accessToken]);

	// exclude current user (yourself) from recommended users
	const pureRecommendedUsers = recommendedUsers.filter((user) => user.id !== currentUserId).splice(0, 6);

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			{isLoading && !recommendedUsers ? (
				<span>loading 6 Users specially for your Taste</span>
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
