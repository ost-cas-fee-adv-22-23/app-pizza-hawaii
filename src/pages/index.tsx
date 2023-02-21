import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid, Button } from '@smartive-education/pizza-hawaii';

import { services } from '../services';

import type { User as TUser } from '../types/User';
import type { Post as TPost } from '../types/Post';
import { useSession } from 'next-auth/react';

type PageProps = {
	currentUser: TUser;
	count: number;
	posts: TPost[];
	error?: string;
};

export default function PageHome({
	currentUser,
	count,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [posts, setPosts] = useState(initialPosts);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length < count);

	const { data: session } = useSession();
	if (error) {
		return <div>An error occurred: {error}</div>;
	}

	const loadMore = async () => {
		setLoading(true);
		const { count, posts: newPosts } = await services.posts.fetchPosts({
			limit: 5,
			offset: posts.length,
		});

		const { users } = await services.users.fetchUsers({
			accessToken: session?.accessToken as string,
		});

		const postsToAdd = newPosts
			.map((post) => {
				const author = users.find((user) => user.id === post.creator);
				if (author) {
					post.creator = author;
				}
				return post;
			})
			.filter((post) => typeof post.creator === 'object');

		setLoading(false);
		setHasMore(posts.length + postsToAdd.length < count);
		setPosts([...posts, ...postsToAdd]);
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
		return { props: { currentUser: null, posts: [], count: 0, error: 'No token found' } };
	}
	try {
		const { count, posts } = await services.posts.fetchPosts({ limit: 5 });
		const { users } = await services.users.fetchUsers({
			accessToken: session?.accessToken as string,
		});

		return {
			props: {
				currentUser: session?.user,
				count,
				posts: posts
					.map((post) => {
						const author = users.find((user) => user.id === post.creator);
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

		return { props: { error: message, currentUser: session?.user, posts: [], count: 0 } };
	}
};
