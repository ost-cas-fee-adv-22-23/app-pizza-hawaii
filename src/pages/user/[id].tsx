import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';

import { MainLayout } from '../../components/MainLayout';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ContentCard } from '../../components/ContentCard';

import { Switch, Headline, UserName, IconLink, TimeStamp, Richtext, Grid, Button } from '@smartive-education/pizza-hawaii';

import { services } from '../../services';

import { TPost, TUser } from '../../types';

type TUserPage = {
	user: TUser;
	mumbles: TPost[];
	likes: TPost[];
};

export default function UserPage({ user, mumbles, likes }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [currentPostType, setCurrentPostType] = useState('mumbles');

	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	const isCurrentUser = currentUser?.id === user.id;

	const postsToRender: Record<string, TPost[]> = {
		mumbles,
		likes,
	};

	return (
		<>
			<Head>
				<title>{`Mumble Page of ${user.fullName}`}</title>
			</Head>

			<MainLayout>
				<ProfileHeader user={user} canEdit={isCurrentUser} />
				<div className="mb-2 text-slate-900 pr-48">
					<Headline level={3}>{user.fullName}</Headline>
				</div>

				<span className="flex flex-row align-baseline gap-3 mb-3">
					<UserName href={user.profileLink}>{user.userName}</UserName>

					<IconLink as="span" icon="location" colorScheme="slate" size="S">
						{user.city}
					</IconLink>

					<IconLink as="span" icon="calendar" colorScheme="slate" size="S">
						<TimeStamp date={user.createdAt} prefix="Mitglied seit" />
					</IconLink>
				</span>

				<div className="text-slate-400 mb-8">
					<Richtext size="M">{user.bio}</Richtext>
				</div>
				{isCurrentUser ? (
					<Grid variant="col" gap="M" marginBelow="M">
						<Switch
							label="Wechsle deine angezeigten Mumbles"
							options={[
								{
									label: 'Meine Mumbles',
									value: 'mumbles',
								},
								{
									label: 'Meine Likes',
									value: 'likes',
								},
							]}
							value="mumbles"
							name="posttype"
							onChange={(event: ChangeEvent): void => {
								const value = (event.target as HTMLInputElement).value;
								setCurrentPostType(value);
							}}
						/>
					</Grid>
				) : (
					<Button as="button" size="M" colorScheme="violet">
						Follow
					</Button>
				)}
				<Grid variant="col" gap="M" marginBelow="M">
					{postsToRender[currentPostType] &&
						postsToRender[currentPostType]
							.sort((a: PostType, b: PostType) => {
								return new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1;
							})
							.map((post) => {
								return <ContentCard key={post.id} variant="timeline" post={post} />;
							})}
				</Grid>
			</MainLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<TUserPage> = async ({ req, params }) => {
	const userId: string = params?.id as string;
	const session = await getToken({ req });

	if (!session?.accessToken) {
		return { props: { error: 'No token found' } };
	}

	try {
		const { users } = await services.users.getUsers({
			accessToken: session?.accessToken,
		});

		// const user = await services.users.getUserById({
		// 	id: userId,
		// 	accessToken: session?.accessToken,
		// });

		const user = users.find((user) => user.id === userId);

		let mumbles = await services.posts.getPostsByUserId({
			id: userId,
			accessToken: session?.accessToken,
		});

		mumbles = mumbles.map((post) => {
			const creator = users.find((user) => user.id === post.creator);
			return {
				...post,
				creator: creator,
			};
		});

		let likes = await services.posts.getLikedPostsByCurrentUser({
			id: userId,
			accessToken: session?.accessToken,
		});

		likes = likes.map((post) => {
			const creator = users.find((user) => user.id === post.creator);
			return {
				...post,
				creator: creator,
			};
		});

		return {
			props: {
				user,
				mumbles,
				likes,
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = String(error);
		}

		return { props: { error: message } };
	}
};
