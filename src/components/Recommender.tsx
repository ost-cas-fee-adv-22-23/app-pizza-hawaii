import React, { FC, useEffect, useSession } from 'react';
import { TUserCard } from '../types';
import { Grid, UserCard, Card, Headline } from '@smartive-education/pizza-hawaii';

export const Recommender: FC<TRecommender> = (props) => {
	// const { data: session } = useSession();

	useEffect(() => {
		const fetchRecUsers = async () => {
			const response = await fetch('/api/recommendations');
			const data = await response.json();
			console.log('%cRecommender.tsx line:5 data', 'color: white; background-color: #33aade;', data);
		};
	}, []);

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
			<Grid variant="row" gap="S">
				<div>
					<Card user={dummyUser}>
						<Headline as="h4" level={4}>
							{dummyUser.fullName}
						</Headline>
					</Card>
				</div>
			</Grid>
		</>
	);
};
