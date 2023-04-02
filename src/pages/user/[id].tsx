import { ChangeEvent, useState, FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import NextLink from 'next/link';
import ErrorPage from 'next/error';

import { Switch, Headline, IconText, TimeStamp, Richtext, Grid } from '@smartive-education/pizza-hawaii';

import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { ProfileHeader } from '../../components/ProfileHeader';
import { UserRecommender } from '../../components/widgets/UserRecommender';
import { FollowUserButton } from '../../components/FollowUserButton';
import { PostList } from '../../components/post/PostList';

import { services } from '../../services';
import { TPost, TUser } from '../../types';

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
			description={`Entdecken Sie die Mumbles von ${user.userName} - besuchen Sie die Seite eines Mumble-Nutzers.`}
		>
			<>
				<ProfileHeader user={user} canEdit={isCurrentUser} />
				<div className="mb-2 pr-48">
					<Headline level={3}>{user.displayName}</Headline>
				</div>

				<span className="flex flex-row align-baseline gap-3 mb-3">
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
				</span>

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
