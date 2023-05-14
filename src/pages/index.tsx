import { Button, Headline, Label } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import React from 'react';

import { MainLayout } from '../components/layout/MainLayout';
import { PostCollection } from '../components/post/PostCollection';
import { services } from '../services';

export default function PageHome({ postCount: postCount, posts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	/**
	 * if posts are undefined we are re-routing (replacing!) to the same page to trigger the getServerSideProps
	 * This happens rarely but we need to handle it, when a user navigates back from a page
	 * and the getServerSide props are not in the cache anymore or next sends just json data to the client instead of the full page.
	 * next.js issue see: https://github.com/vercel/next.js/issues/34365
	 */

	const router = useRouter();
	const postsAvailable = posts === undefined ? false : true;
	const canLoadMore = postCount > 0 || false;
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const manualRefresh = (
		<>
			<Label as="p" size="L">
				No Mumbles Posts ? - there must be a Hickup somewhere...{' '}
			</Label>
			<Button colorScheme="gradient" size="L" icon="repost" onClick={() => refreshData()}>
				Load Mumbles again.
			</Button>
		</>
	);

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
				{postsAvailable ? (
					<PostCollection
						headline="Whats new in Mumble...."
						posts={posts || []}
						canLoadMore={canLoadMore}
						canAdd={true}
						autoUpdate={true}
					/>
				) : (
					manualRefresh
				)}
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
				session,
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
