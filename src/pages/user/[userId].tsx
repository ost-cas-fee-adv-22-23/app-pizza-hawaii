import { Grid, Headline, IconText, Label, Richtext, Switch, TimeStamp } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import NextLink from 'next/link';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import React, { ChangeEvent, FC, useState } from 'react';

import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { PostCollection } from '../../components/post/PostCollection';
import { ProfileHeader } from '../../components/ProfileHeader';
import { FollowerList } from '../../components/widgets/FollowerList';
import { FollowUserButton } from '../../components/widgets/FollowUserButton';
import { UserRecommender } from '../../components/widgets/UserRecommender';
import { useFolloweeContext } from '../../context/useFollowee';
import { services } from '../../services';
import { TPost, TUser } from '../../types';

/**
 * @description
 * This page shows detail of any user and the curent user profile with some additional features.
 */
type TFetchDataResult = {
	posts: TPost[];
	count: number;
};

type TUserPage = {
	user: TUser;
	posts: TFetchDataResult;
	likes: TFetchDataResult;
};

const TAB_NAME: Record<string, string> = {
	POSTS: 'posts',
	LIKES: 'likes',
	FOLLOWER: 'follower',
};

const UserPage: FC<TUserPage> = ({ user, posts, likes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { followees } = useFolloweeContext();
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const [currentTab, setCurrentTab] = useState(TAB_NAME.POSTS);

	if (!user) {
		throw new Error('User not found');
	}

	const isCurrentUser = currentUser?.id === user.id;

	const switchOptions = [
		{ label: 'Meine Mumbles', value: TAB_NAME.POSTS },
		{ label: 'Meine Likes', value: TAB_NAME.LIKES },
	];

	if (followees?.length || currentTab === TAB_NAME.FOLLOWER) {
		switchOptions.push({ label: `Meine Follower (${followees?.length})`, value: TAB_NAME.FOLLOWER });
	}

	const isFreshUser = new Date(user.createdAt).getTime() > new Date().getTime() - 45 * 60 * 1000;

	return (
		<MainLayout
			title={`Mumble - ${user.displayName} (${user.userName})`}
			seo={{
				description: `Entdecken Sie die Mumbles von ${user.userName}.`,
				image: { url: user?.avatar, alt: user?.displayName },
				pageType: 'profile',
			}}
		>
			<>
				<ProfileHeader user={user} canEdit={isCurrentUser} />
				<div className="mb-2 pr-48 sm:mt-14 sm:pr-0">
					<Headline level={3}>{user.displayName}</Headline>
				</div>

				<Grid variant="row" gap="S" marginBelow="M" wrapBelowScreen="md">
					<NextLink href={user.profileLink}>
						<IconText icon="profile" colorScheme="violet" size="S">
							{user.userName}
						</IconText>
					</NextLink>
					<IconText icon="location" colorScheme="slate" size="S">
						{user.city}
					</IconText>
					{user.createdAt && new Date(user.createdAt) && (
						<IconText icon="calendar" colorScheme="slate" size="S">
							{isFreshUser ? (
								<time
									title={
										new Date(user.createdAt).toLocaleDateString('de-CH') +
										' ' +
										new Date(user.createdAt).toLocaleTimeString('de-CH', {
											hour: '2-digit',
											minute: '2-digit',
										})
									}
									dateTime={new Date(user.createdAt).toISOString()}
								>
									neues Mitglied
								</time>
							) : (
								<TimeStamp date={user.createdAt} prefix="Mitglied seit" />
							)}
						</IconText>
					)}
				</Grid>

				<div className="text-slate-500 mb-8">
					<Richtext size="M">{user.bio}</Richtext>
				</div>

				<Grid variant="col" gap="M" marginBelow="M">
					{isCurrentUser ? (
						<UserRecommender currentUserId={user.id} limit={6} />
					) : (
						<FollowUserButton userId={user.id} />
					)}
				</Grid>

				{isCurrentUser ? (
					<>
						<Grid variant="col" gap="M" marginBelow="M">
							<Switch
								label="Wechsle deine angezeigten Mumbles"
								options={switchOptions}
								value={TAB_NAME.POSTS}
								name="posttype"
								onChange={(event: ChangeEvent): void => {
									const value = (event.target as HTMLInputElement).value;
									setCurrentTab(value);
								}}
							/>
						</Grid>

						{currentTab === TAB_NAME.POSTS && (
							<PostCollection
								posts={posts.posts}
								canLoadMore={posts.count > 0}
								canAdd={false}
								filter={{
									creator: user.id,
								}}
							/>
						)}
						{currentTab === TAB_NAME.LIKES && (
							<>
								<PostCollection
									posts={likes.posts}
									canLoadMore={false}
									canAdd={false}
									autoUpdate={false}
									filter={{
										likedBy: [user.id],
									}}
								/>
								{likes.count > 0 && (
									<Label as="p" size="M">
										And about {likes.count} more ...
									</Label>
								)}
							</>
						)}
						{currentTab === TAB_NAME.FOLLOWER && <FollowerList />}
					</>
				) : (
					<PostCollection
						posts={posts.posts}
						canLoadMore={posts.count > 0}
						canAdd={false}
						filter={{
							creator: user.id,
						}}
					/>
				)}
			</>
		</MainLayout>
	);
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const userId = params?.userId as string;

	const session = await getToken({ req });
	const accessToken = session?.accessToken as string;

	try {
		const user = await services.users.getUser({
			id: userId,
			accessToken,
		});

		const posts = await services.posts.getPosts({
			creator: userId,
			limit: 5,
			accessToken,
		});

		const likes = await services.posts.getPostsByQuery({
			likedBy: [userId],
			limit: 20,
			accessToken,
		});

		return {
			props: {
				user,
				session,
				posts: {
					posts: posts.posts,
					count: posts.count,
				},
				likes: {
					posts: likes.posts,
					count: likes.count,
				},
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = 'An error occurred while loading the data.';
		}

		throw new Error(message);
	}
};
