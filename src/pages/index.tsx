import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import ErrorPage from 'next/error';

import { encodeTime, decodeTime } from 'ulid';
import { services } from '../services';
import useIncreasingInterval from '../hooks/useIncreasingInterval';
import { useActiveTabContext } from '../context/useActiveTab';

import { Headline } from '@smartive-education/pizza-hawaii';
import { MainLayout } from '../components/layoutComponents/MainLayout';
import { PostCollection } from '../components/PostCollection';
import { TAddPostProps } from '../components/ContentInput';

import { TPost } from '../types';

export default function PageHome({
	currentUser,
	postCount: initialPostCount,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data: session } = useSession();
	const { isActive: tabIsActive } = useActiveTabContext();

	const [posts, setPosts] = useState<TPost[]>(initialPosts);
	const [canLoadmore, setCanLoadmore] = useState<boolean>(initialPostCount > posts.length);

	const loadLatestPosts = async (loadFullList = false) => {
		const latestPost = loadFullList ? posts[posts.length - 1] : posts[0];
		let lastPostId = latestPost?.id;

		if (loadFullList) {
			// decrement ULID to make sure to load also last post itself
			// TODO: could be done better by decrement random part of ULID only
			lastPostId = encodeTime(decodeTime(lastPostId) - 1, 10) + lastPostId.substring(26 - 16);
		}

		const { posts: newPosts } = await services.api.posts.loadmore({
			newerThan: lastPostId,
		});

		if (!newPosts || newPosts.length < 0) return;

		if (loadFullList) {
			// replace posts with new posts
			setPosts(newPosts);
		} else {
			// prepend new posts to list
			setPosts((currentPosts: TPost[]) => [...newPosts, ...currentPosts]);
		}
	};

	const loadMore = async () => {
		const oldestPost = posts[posts.length - 1];
		const { count: olderPostCount, posts: olderPosts } = await services.api.posts.loadmore({
			olderThan: oldestPost.id,
		});

		if (!olderPosts) {
			setCanLoadmore(false);
			return [];
		}

		setPosts((currentPosts: TPost[]) => [...currentPosts, ...olderPosts]);
		setCanLoadmore(olderPostCount > 0);

		return olderPosts;
	};

	const onAddPost = async (postData: TAddPostProps): Promise<TPost | null> => {
		const newPost = await services.posts.createPost({
			...postData,
			accessToken: session?.accessToken as string,
		});

		if (!newPost) return null;

		setPosts([newPost, ...posts]);

		return newPost;
	};

	const onRemovePost = (id: string) => {
		services.api.posts.remove({ id }).then((result) => {
			if (result) {
				setPosts(posts.filter((post: TPost) => post.id !== id));
			}
		});
	};

	useIncreasingInterval(() => {
		// only load new posts if tab is active
		if(tabIsActive === false) return;

		// randomizes if load full list (to detect deleted posts) or check just for new posts (2/3 chance)
		// to prevent that all users load the full list at the same time when the interval is triggered
		// full list means to load all already visible posts
		// for our use case this is not necessary, but was fun to implement ;)

		const loadFullList = Math.random() > 0.66;
		loadLatestPosts(loadFullList);
	});

	if (error || !currentUser) {
		return <ErrorPage statusCode={500} title={error} />;
	}
	return (
		<MainLayout
			title="Mumble - Welcome to Mumble"
			description="Verpassen Sie nicht die neuesten Mumbles von den besten Nutzern der Plattform. Besuchen Sie die Index-Seite von Mumble und bleiben Sie auf dem Laufenden."
		>
			<main>
				<section className="mx-auto w-full max-w-content">
					<div className="mb-2 text-violet-600">
						<Headline level={2}>Welcome to Mumble</Headline>
					</div>
					<PostCollection
						headline="Whats new in Mumble...."
						posts={posts}
						canAdd={true}
						canLoadmore={canLoadmore}
						onAddPost={onAddPost}
						onRemovePost={onRemovePost}
						onLoadmore={loadMore}
					/>
				</section>
			</main>
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
