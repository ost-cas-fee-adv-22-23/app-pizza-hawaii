import React, { FC, useEffect, useState } from 'react';
import { Grid, Card, Headline } from '@smartive-education/pizza-hawaii';
import { services } from '../services';
// import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';

export const Recommender: FC<TRecommender> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedUsers, setRecommendedUsers] = useState([]);
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.accessToken !== undefined) {
			const fetchRecommendedUsers = async (accessToken) => {
				// TODO: Fetch recommended users via API
				// const response = await fetch('/api/recommendations');
				const recommendedUsers = await services.users.getUsers({
					limit: 6,
					offset: 0,
					accessToken: session.accessToken,
				});

				setRecommendedUsers({ recommendedUsers });
			};
			fetchRecommendedUsers();
			setIsLoading(false);
		}
	}, []);

	console.log('%cRecommender.tsx line:27 recommendedUsers', 'color: #26bfa5;', recommendedUsers);

	const dummyUser = {
		id: '123',
		userName: 'johndoe',
		fullName: 'John Doe',
		profileLink: '/user/johndoe',
		email: 'johndoe@example.com',
		city: 'Zürich',
		avatar: 'https://faces-img.xcdn.link/image-lorem-face-6307.jpg',
		posterImage: '//picsum.photos/seed/johndoe1/1600/1157/',
		bio: 'Ich bin Softwareentwickler und interessiere mich für die Entwicklung von Web-Anwendungen mit modernen Technologien. In meiner Freizeit gehe ich gerne wandern und genieße die Natur.',
		createdAt: '2022-11-24T21:45:51.402Z',
	};

	return (
		<>
			<Headline as="h2" level={3}>
				Empfohlene User
			</Headline>
			{isLoading && !recommendedUsers
			? (<span>loading Data... - a loading animation would be nice- </span>)
			: (	<Grid variant="row" gap="S">
					{recommendedUsers.map((user) => (
					<Card key={user.id} variant="small" user={user} />
				))}
			</Grid>
			)}
		</>
	);
};
