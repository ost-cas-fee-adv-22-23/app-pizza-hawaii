import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import ErrorPage from 'next/error';
import Head from 'next/head';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { ContentCard } from '../components/ContentCard';
import { ContentInput, TAddPostProps } from '../components/ContentInput';
import { Headline, Grid, Button } from '@smartive-education/pizza-hawaii';

import { services } from '../services';
import useIncreasingInterval from '../hooks/useIncreasingInterval';

import type { TPost } from '../types';

export default function PageHome({
	currentUser,
	postCount: initialPostCount,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data: session } = useSession();

	const [posts, setPosts] = useState(initialPosts);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts?.length < initialPostCount);
	const [latestPosts, setLatestPosts] = useState<TPost[]>([]);

	if (error || !currentUser) {
		return <ErrorPage statusCode={500} title={error} />;
	}
	const updatePosts = () => {
		setPosts([...latestPosts, ...posts]);
		setLatestPosts([]);
	};

	const loadLatestPosts = async () => {
		const latestPost = posts[0];
		const { posts: newPosts } = await services.api.posts.loadmore({
			newerThan: latestPost.id,
		});

		if (newPosts?.length > 0) {
			setLatestPosts(newPosts);
		}
	};

	const loadMore = async () => {
		setLoading(true);
		try {
			const { count: newOlderPostCount, posts: newOlderPosts } = await services.api.posts.loadmore({
				olderThan: posts[posts.length - 1].id,
			});

			setHasMore(newOlderPosts.length < newOlderPostCount);
			setPosts([...posts, ...newOlderPosts]);
		} catch (error) {
			// TODO: find something better
			console.error(error);
		}

		setLoading(false);
	};

	const onAddPost = async (postData: TAddPostProps) => {
		try {
			const newPost = await services.posts.createPost({
				...postData,
				accessToken: session?.accessToken as string,
			});

			setPosts([newPost, ...posts]);
		} catch (error) {
			console.error('onSubmitHandler: error', error);
		}
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

	useIncreasingInterval(() => {
		loadLatestPosts();
	});

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
				<main>
					<section className="mx-auto w-full max-w-content">
						<div className="mb-2 text-violet-600">
							<Headline level={2}>Welcome to Mumble</Headline>
						</div>

						<div className="text-slate-500 mb-8">
							<Headline level={4} as="p">
								Whats new in Mumble....
							</Headline>

							{latestPosts?.length > 0 && (
								<Button colorScheme="slate" onClick={() => updatePosts()}>
									We have {latestPosts.length} new posts for you!
								</Button>
							)}
						</div>

						<Grid variant="col" gap="M" marginBelow="M">
							<ContentInput
								variant="newPost"
								headline="Hey, was geht ab?"
								author={currentUser}
								placeHolderText="Deine Meinung zählt"
								onAddPost={onAddPost}
							/>
							{posts?.map((post: TPost) => {
								return (
									<ContentCard key={post.id} variant="timeline" post={post} onDeletePost={onRemovePost} />
								);
							})}
						</Grid>

						{hasMore ? (
							<Button colorScheme="slate" onClick={() => loadMore()} disabled={loading}>
								{loading ? '...' : 'Load more'}
							</Button>
						) : (
							''
						)}
					</section>
				</main>
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
