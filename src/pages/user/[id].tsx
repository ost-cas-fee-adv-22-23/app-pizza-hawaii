import { ChangeEvent, useState, FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import ErrorPage from 'next/error';

import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ContentCard } from '../../components/ContentCard';
import { UserRecommender } from '../../components/UserRecommender';

import { Switch, Headline, IconText, TimeStamp, Richtext, Grid } from '@smartive-education/pizza-hawaii';

import { services } from '../../services';

import { TPost, TUser } from '../../types';
import { FollowUserButton } from '../../components/FollowUserButton';

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
	posts,
	likes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [currentPostType, setCurrentPostType] = useState(PostType.POSTS);

	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	if (!user) {
		return <ErrorPage statusCode={403} title={'no user'} />;
	}

	const isCurrentUser = currentUser?.id === user.id;
	const postsToRender: Record<string, TPost[]> = {
		posts,
		likes,
	};

	const switchoptions = [
		{ label: 'Meine Mumbles', value: PostType.POSTS },
		{ label: 'Meine Likes', value: PostType.LIKES },
	];

	const onRemovePost = async (id: string) => {
		try {
			const result = await services.api.posts.remove({ id });

			if (result) {
				posts = posts.filter((post: TPost) => post.id !== id) as TPost[];
			}
		} catch (error) {
			console.error('onSubmitHandler: error', error);
		}
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
				{isCurrentUser ? (
					<>
						<Grid variant="col" gap="M" marginBelow="M">
							<UserRecommender currentUserId={user.id} />
						</Grid>
						<Grid variant="col" gap="M" marginBelow="M">
							<Switch
								label="Wechsle deine angezeigten Mumbles"
								options={switchoptions}
								value={PostType.POSTS}
								name="posttype"
								onChange={(event: ChangeEvent): void => {
									const value = (event.target as HTMLInputElement).value as PostType;
									setCurrentPostType(value);
								}}
							/>
						</Grid>
						<Grid variant="col" gap="M" marginBelow="M">
							{postsToRender[currentPostType] &&
								postsToRender[currentPostType].map((post) => {
									return (
										<ContentCard
											key={post.id}
											variant="timeline"
											post={post}
											onDeletePost={onRemovePost}
										/>
									);
								})}
						</Grid>
					</>
				) : (
					<>
						<FollowUserButton userId={user.id} />
						<br />
						<Grid variant="col" gap="M" marginBelow="M">
							{posts &&
								posts.map((post: TPost) => {
									return <ContentCard key={post.id} variant="timeline" post={post} />;
								})}
						</Grid>
					</>
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
