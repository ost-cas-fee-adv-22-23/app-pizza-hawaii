import { Headline } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { decodeTime, encodeTime } from 'ulid';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { PostCollection } from '../components/post/PostCollection';
import { TAddPostProps } from '../components/post/PostCreator';
import { useActiveTabContext } from '../context/useActiveTab';
import useIncreasingInterval from '../hooks/useIncreasingInterval';
import { services } from '../services';
import { TPost } from '../types';
import Custom500Page from './500';

export default function PageHome({
	postCount: initialPostCount,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data: session } = useSession();
	const { isActive: tabIsActive } = useActiveTabContext();

	const [posts, setPosts] = useState<TPost[]>(initialPosts);
	const [canLoadmore, setCanLoadmore] = useState<boolean>(initialPostCount > posts.length);

	const loadPosts = async (loadFullList = false) => {
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
		// get oldest post
		const oldestPost = posts[posts.length - 1];

		// fetch posts older than oldest post
		const { count: olderPostCount, posts: olderPosts } = await services.api.posts.loadmore({
			olderThan: oldestPost.id,
		});

		// if no older posts are available, set canLoadmore to false and return empty array
		if (!olderPosts) {
			setCanLoadmore(false);
			return [];
		}

		// append older posts to list
		setPosts((currentPosts: TPost[]) => [...currentPosts, ...olderPosts]);

		// set canLoadmore to true if there are more posts available
		setCanLoadmore(olderPostCount > 0);

		// return older posts
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

	const onRemovePost = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		setPosts(posts.filter((post: TPost) => post.id !== id));
	};

	useIncreasingInterval(() => {
		// only load new posts if browser tab is active
		if (!tabIsActive) return;

		// randomizes if load full list (to detect deleted posts) or check just for new posts (2/3 chance)
		// to prevent that all users load the full list at the same time when the interval is triggered
		// full list means to load all already visible posts
		// for our use case this is not necessary, but was fun to implement ;)

		const loadFullList = Math.random() > 0.66;
		loadPosts(loadFullList);
	});

	if (error) {
		return <Custom500Page errorInfo={error} />;
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
					canAdd={true}
					canLoadmore={canLoadmore}
					onAddPost={onAddPost}
					onRemovePost={onRemovePost}
					onLoadmore={loadMore}
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
			limit: 10,
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
