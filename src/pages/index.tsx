import { Headline } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ErrorPage from 'next/error';
import { getToken } from 'next-auth/jwt';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { PostCollection } from '../components/post/PostCollection';
import { services } from '../services';

export default function PageHome({
	postCount: postCount,
	posts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	if (error) {
		return <ErrorPage statusCode={500} title={error} />;
	}

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
					posts={posts}
					canLoadMore={postCount > posts.length}
					canAdd={true}
					autoUpdate={true}
					filter="all"
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
