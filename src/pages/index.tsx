import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid, Button } from '@smartive-education/pizza-hawaii';
import { services } from '../services';

import type { TPost, TUser } from '../types';

type PageProps = {
	currentUser: TUser;
	count: number;
	posts: TPost[];
	users: TUser[];
	error?: string;
};

export default function PageHome({
	currentUser,
	postCount: initialPostCount,
	users: initialUsers,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [posts, setPosts] = useState(initialPosts);
	const [postCount, setPostCount] = useState(initialPostCount);
	const [users] = useState(initialUsers);

	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length < postCount);

	if (error) {
		return <div>An error occurred: {error}</div>;
	}

	const loadMore = async () => {
		setLoading(true);

		try {
			const { count: newPostCount, posts: newPosts } = await services.posts.fetchPosts({
				limit: 5,
				offset: posts.length,
			});

			setPostCount(newPostCount);

			const postsToAdd = newPosts
				.map((post) => {
					const author = users.find((user: TUser) => user.id === post.creator);
					if (author) {
						post.creator = author;
					}
					return post;
				})
				.filter((post) => typeof post.creator === 'object');

			if (postsToAdd.length !== newPosts.length) {
				console.warn('Some users could not loaded');
				// todo: decide what to do here
			}

			setHasMore(posts.length + newPosts.length < postCount);
			setPosts([...posts, ...postsToAdd]);
		} catch (error) {
			console.warn(error);
			// todo: error handling
		}

		setLoading(false);
	};

	return (
		<div className="bg-slate-100">
			<Header user={currentUser} />
			<main className="px-content">
				<section className="mx-auto w-full max-w-content">
					<div className="mb-2 text-violet-600">
						<Headline level={2}>Welcome to Storybook</Headline>
					</div>

					<div className="text-slate-500 mb-8">
						<Headline level={4} as="p">
							Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
						</Headline>
					</div>

					<Grid variant="col" gap="M" marginBelow="M">
						<ContentInput
							variant="newPost"
							headline="Hey, was geht ab?"
							author={currentUser}
							placeHolderText="Deine Meinung zählt"
						/>

						{posts.map((post) => {
							return <ContentCard key={post.id} variant="timeline" post={post} />;
						})}
					</Grid>

					{hasMore ? (
						<Button as="button" colorScheme="slate" onClick={() => loadMore()} disabled={loading}>
							{loading ? '...' : 'Load more'}
						</Button>
					) : (
						''
					)}
				</section>
			</main>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
	const session = await getToken({ req });
	if (!session) {
		return { props: { currentUser: null, posts: [], users: [], postCount: 0, error: 'No token found' } };
	}
	try {
		const { count: postCount, posts } = await services.posts.fetchPosts({ limit: 5 });
		const { users } = await services.users.fetchUsers({
			accessToken: session?.accessToken as string,
		});

		return {
			props: {
				currentUser: session?.user,
				postCount,
				users,
				posts: posts
					.map((post) => {
						const author = users?.find((user) => user.id === post.creator);
						if (author) {
							post.creator = author;
						}
						return post;
					})
					.filter((post) => typeof post.creator === 'object'),
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = String(error);
		}

		return { props: { error: message, currentUser: session?.user, posts: [], users: [], postCount: 0 } };
	}
};
