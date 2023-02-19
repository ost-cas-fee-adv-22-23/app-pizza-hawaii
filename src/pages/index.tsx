import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';

import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid } from '@smartive-education/pizza-hawaii';

import { services } from '../services';

import type { User as TUser } from '../types/User';
import type { Post as TPost } from '../types/Post';

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

	if (error) {
		return (
			<div>
				An error occurred: {error} <br />
				<Link href="/login">to Login page</Link>
			</div>
		);
	}

	const loadMore = async () => {
		setLoading(true);
		const { count, posts: newPosts } = await services.posts.fetchPosts({
			limit: 5,
			offset: posts.length,
		});

		setLoading(false);
		setHasMore(posts.length + newPosts.length < count);
		setPosts([...posts, ...newPosts]);
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
							return (
								// <Link href={`/mumble/${post.id}`} key={post.id}>
								<ContentCard key={post.id} variant="timeline" post={post}  />
								// </Link>
							);
						})}
					</Grid>

					{hasMore ? (
						<button
							onClick={() => loadMore()}
							disabled={loading}
							className="bg-indigo-400 px-2 py-1 rounded-lg mt-4"
						>
							{loading ? '...' : 'Load more'}
						</button>
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
			accessToken: session?.accessToken,
		});

		return {
			props: {
				currentUser: session?.user,
				count,
				posts: posts.map((post) => {
					const author = users.find((user) => user.id === post.creator);
					if (author) {
						post.creator = author;
					}
					return post;
				}),
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
