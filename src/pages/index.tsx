import { Headline } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ErrorPage from 'next/error';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useEffect, useReducer, useState } from 'react';
import { decodeTime, encodeTime } from 'ulid';

import { MainLayout } from '../components/layoutComponents/MainLayout';
import { PostCollection } from '../components/post/PostCollection';
import { TAddPostProps } from '../components/post/PostCreator';
import { useActiveTabContext } from '../context/useActiveTab';
import useIncreasingInterval from '../hooks/useIncreasingInterval';
import PCReducer, { ActionType as PCActionType, initialState as initialPCState } from '../reducer/postCollectionReducer';
import { services } from '../services';
import { TPost } from '../types';

export default function PageHome({
	postCount: initialPostCount,
	posts: initialPosts,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [postState, postDispatch] = useReducer(PCReducer, {
		...initialPCState,
		posts: initialPosts,
	});
	const { data: session } = useSession();
	const { isActive: tabIsActive } = useActiveTabContext();

	const [canLoadmore, setCanLoadmore] = useState<boolean>(initialPostCount > postState.posts.length);

	const loadPosts = async (loadFullList = false) => {
		const latestPost = loadFullList ? postState.posts[postState.posts.length - 1] : postState.posts[0];
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
			postDispatch({ type: PCActionType.POSTS_SET, payload: newPosts });
		} else {
			// prepend new posts to list
			postDispatch({ type: PCActionType.POSTS_ADD, payload: newPosts });
		}
	};

	const loadMore = async () => {
		// get oldest post
		const oldestPost = postState.posts[postState.posts.length - 1];

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
		postDispatch({ type: PCActionType.POSTS_ADD, payload: olderPosts });

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

		postDispatch({ type: PCActionType.POSTS_ADD, payload: newPost });

		return newPost;
	};

	const onRemovePost = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}
		postDispatch({ type: PCActionType.POSTS_DELETE, payload: id });
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

	useEffect(() => {
		// load full list of posts when user switches to browser tab
		if (tabIsActive) {
			loadPosts(true);
		}
	}, [tabIsActive, loadPosts]);

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
					posts={postState.posts}
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
