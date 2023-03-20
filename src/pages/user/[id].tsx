import { ChangeEvent, useState, FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';

import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ContentCard } from '../../components/ContentCard';

import { Switch, Headline, UserName, IconLink, TimeStamp, Richtext, Grid, Button } from '@smartive-education/pizza-hawaii';

import { services } from '../../services';

import { TPost, TUser } from '../../types';

type TUserPage = {
	user: TUser;
	posts: TPost[];
	likes?: TPost[];
};

enum PostType {
	POSTS = 'posts',
	LIKES = 'likes',
}

const UserPage: FC<TUserPage> = ({
	user,
	posts: initialPosts,
	likes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [currentPostType, setCurrentPostType] = useState(PostType.POSTS);

	const [posts, setPosts] = useState(initialPosts);
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	if (!user) {
		// TODO: better content or 404 page with nice illustration of a lost user
		return (
			<MainLayout>
				<div className="text-slate-900 text-center">
					<Headline level={3}>User not found</Headline>
				</div>
			</MainLayout>
		);
	}

	const isCurrentUser = currentUser?.id === user.id;

	const postsToRender: Record<string, TPost[]> = {
		posts,
		likes,
	};

	const onRemovePost = async (id: string) => {
		try {
			const result = await services.api.posts.remove({ id });

			if (result) {
				setPosts(posts.filter((post: TPost) => post.id !== id));
			}
		} catch (error) {
			console.error('onSubmitHandler: error', error);
		}
	};

	return (
		<>
			<Head>
				<title>{`Mumble Page of ${user.displayName}`}</title>
			</Head>

			<MainLayout>
				<>
					<ProfileHeader user={user} canEdit={isCurrentUser} />
					<div className="mb-2 text-slate-900 pr-48">
						<Headline level={3}>{user.displayName}</Headline>
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
										value: PostType.POSTS,
									},
									{
										label: 'Meine Likes',
										value: PostType.LIKES,
									},
								]}
								value={PostType.POSTS}
								name="posttype"
								onChange={(event: ChangeEvent): void => {
									const value = (event.target as HTMLInputElement).value as PostType;
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
							postsToRender[currentPostType].map((post) => {
								return (
									<ContentCard key={post.id} variant="timeline" post={post} onDeletePost={onRemovePost} />
								);
							})}
					</Grid>
				</>
			</MainLayout>
		</>
	);
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const userId = params?.id as string;
	const session = await getToken({ req });

	try {
		const user = await services.users.getUser({
			id: userId,
			accessToken: session?.accessToken as string,
		});

		const posts = await services.posts.getPostsOfUser({
			id: userId,
			accessToken: session?.accessToken as string,
		});

		const likes = await services.posts.getPostsLikedByUser({
			id: userId,
			accessToken: session?.accessToken as string,
		});

		return {
			props: {
				user,
				posts,
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
