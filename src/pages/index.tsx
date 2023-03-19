import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
// import Link from 'next/link'; TODO: use Link in Design System
import Head from 'next/head';
import Custom500Page from './500';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid, Button } from '@smartive-education/pizza-hawaii';
import { services } from '../services';

import type { TPost } from '../types';

export default function PageHome({
	currentUser,
	postCount: initialPostCount,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [posts, setPosts] = useState(initialPosts);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length < initialPostCount);

	if (error) {
		return (
			<MainLayout>
				<div className="text-slate-900 text-center">
					<Headline level={3}>An error occurred while loading the posts. Please try again later.</Headline>
					Error: {error}
				</div>
			</MainLayout>
		);
		return <Custom500Page errorInfo={error} />;
	}

	const loadMore = async () => {
		setLoading(true);
		try {
			const { count: newPostCount, posts: newPosts } = await services.api.posts.loadmore({
				olderThan: posts[posts.length - 1].id,
			});

			setHasMore(newPosts.length < newPostCount);
			setPosts([...posts, ...newPosts]);
		} catch (error) {
			<Custom500Page errorInfo={error} />;
		}

		setLoading(false);
	};

	return (
		<MainLayout>
			<>
				<Head>
					<title>Mumble - Alle Mumbles</title>
					<meta
						name="description"
						content="Verpassen Sie nicht die neuesten Mumbles von den besten Nutzern der Plattform. Besuchen Sie die Index-Seite von Mumble und bleiben Sie auf dem Laufenden."
					/>
				</Head>
				<section className="mx-auto w-full max-w-content">
					<div className="mb-2 text-violet-600">
						<Headline level={2}>Welcome to Mumble</Headline>
					</div>

					<div className="text-slate-500 mb-8">
						<Headline level={4} as="p">
							Whats new in Mumble....
						</Headline>
					</div>

					<Grid variant="col" gap="M" marginBelow="M">
						<ContentInput
							variant="newPost"
							headline="Hey, was geht ab?"
							author={currentUser}
							placeHolderText="Deine Meinung zählt"
						/>

						{posts.map((post: TPost) => {
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
			</>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getToken({ req });
	const accessToken = session?.accessToken as string;

	try {
		const { count: postCount, posts } = await services.posts.getPosts({
			limit: 10,
			accessToken,
		});

		return {
			props: {
				currentUser: session?.user,
				postCount,
				posts,
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
