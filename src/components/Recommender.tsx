import React, { FC, useEffect, useState } from 'react';
import { Grid, Headline } from '@smartive-education/pizza-hawaii';
import { services } from '../services';
import { useSession } from 'next-auth/react';
import { UserCard } from './UserCard';

interface TRecommender {
	currentUser: string;
}

export const Recommender: FC<TRecommender> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([]);
	const { data: session } = useSession();
	const { currentUser } = props;

	useEffect(() => {
		if (session?.accessToken !== undefined) {
			const fetchRecommendedUsers = async () => {
				// TODO: should we fetch recommended users via API ?
				const recommendedUsers = await services.users.getUsers({
					limit: 7,
					offset: 0,
					accessToken: session.accessToken,
				});
				setRecommendedUsers(recommendedUsers.users);
			};
			fetchRecommendedUsers();
			setIsLoading(false);
		}
	}, [session]);

	// exclude current user from recommended users
	const pureRecommendedUsers = recommendedUsers.filter((user) => user.id !== currentUser);

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			{isLoading && !recommendedUsers ? (
				<span>loading Data... - a loading animation would be nice- </span>
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
