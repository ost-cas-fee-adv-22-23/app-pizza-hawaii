import { Grid, Headline, IconText, Richtext, Switch, TimeStamp } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ErrorPage from 'next/error';
import NextLink from 'next/link';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FC, useState } from 'react';

import { FollowUserButton } from '../../components/FollowUserButton';
import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { PostList } from '../../components/post/PostList';
import { ProfileHeader } from '../../components/ProfileHeader';
import { UserRecommender } from '../../components/widgets/UserRecommender';
import { services } from '../../services';
import { TPost, TUser } from '../../types';

/**
 * @description
 * This page shows detail of any user and the curent user profile with some additional features.
 */

type TUserPage = {
	user: TUser;
	posts: TPost[];
	likes: TPost[];
};

const POST_TYPE: Record<string, string> = {
	POSTS: 'posts',
	LIKES: 'likes',
};

const UserPage: FC<TUserPage> = ({ user, posts, likes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [currentPostType, setCurrentPostType] = useState(POST_TYPE.POSTS);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	if (!user) {
		return <ErrorPage statusCode={403} title={'User not found.'} />;
	}

	const isCurrentUser = currentUser?.id === user.id;
	const postsToRender: Record<string, TPost[]> = {
		posts,
		likes,
	};

	const switchoptions = [
		{ label: 'Meine Mumbles', value: POST_TYPE.POSTS },
		{ label: 'Meine Likes', value: POST_TYPE.LIKES },
	];

	const onRemovePost = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		posts = posts.filter((post: TPost) => post.id !== id) as TPost[];
	};

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
					<IconText icon="calendar" colorScheme="slate" size="S">
						<TimeStamp date={user.createdAt} prefix="Mitglied seit" />
					</IconText>
				</Grid>

				<div className="text-slate-400 mb-8">
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
								options={switchoptions}
								value={POST_TYPE.POSTS}
								name="posttype"
								onChange={(event: ChangeEvent): void => {
									const value = (event.target as HTMLInputElement).value;
									setCurrentPostType(value);
								}}
							/>
						</Grid>

						<PostList posts={postsToRender[currentPostType]} onRemovePost={onRemovePost} />
					</>
				) : (
					<PostList posts={posts} onRemovePost={onRemovePost} />
				)}
			</>
		</MainLayout>
	);
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const userId = params?.userId as string;

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
