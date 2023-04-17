import { Headline } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import React, { useEffect } from 'react';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { PostCollection } from '../components/post/PostCollection';
import { services } from '../services';

export default function PageHome({
	postCount: postCount,
	posts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	console.log('index postCount', postCount);
	console.log('index  posts', posts);

	/**
	 * if posts are undefined we are re-routing (replacing!) to the same page to trigger the getServerSideProps
	 * This happens rarely but we need to handle it, when a user navigates back from a client-side rendered page
	 * and the page is not in the cache anymore or next sends just json data to the client instead of the full page
	 */

	const router = useRouter();
	useEffect(() => {
		if (!posts) {
			router.replace(router.asPath);
		}
	}, [posts, router]);

	if (error) {
		return <ErrorPage statusCode={500} title={error} />;
	}

	const canLoadMore = postCount > 0 || false;

	return (
		<MainLayout
			title="Mumble - Welcome to Mumble"
			seo={{
				description: 'Verpassen Sie nicht die neuesten Mumbles. Bleiben Sie auf dem Laufenden.',
				pageType: 'website',
			}}
		>
			<>
				<div className="mb-2 text-violet-600">
					<Headline level={2}>Welcome to Mumble</Headline>
				</div>
				<PostCollection
					headline="Whats new in Mumble...."
					posts={posts || []}
					canLoadMore={canLoadMore}
					canAdd={true}
					autoUpdate={true}
				/>
			</>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getToken({ req });
	const accessToken = session?.accessToken as string;

	try {
		const { count: postCount, posts } = await services.posts.getPosts({
			limit: 15,
			accessToken,
		});

		return {
			props: {
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

		return { props: { error: message, posts: [], users: [], postCount: 0 } };
	}
};
