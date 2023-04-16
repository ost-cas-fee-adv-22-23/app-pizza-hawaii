import { Button, Grid, Headline } from '@smartive-education/pizza-hawaii';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useReducer, useState } from 'react';
import { decodeTime, encodeTime } from 'ulid';

import { useActiveTabContext } from '../../context/useActiveTab';
import useIncreasingInterval from '../../hooks/useIncreasingInterval';
import PCReducer, {
	ActionType as PCActionType,
	initialState as initialPCState,
	TActionType,
} from '../../reducer/postCollectionReducer';
import { services } from '../../services';
import { TPost } from '../../types';
import { PostList } from '../post/PostList';
import { PostCreator, TAddPostProps } from './PostCreator';

type TPostCollectionFilter = {
	creator?: string;
	likedBy?: string[];
	tags?: string[];
};

export type TPostCollectionProps = {
	headline?: string;
	posts: TPost[];
	canAdd?: boolean;
	canLoadMore?: boolean;
	filter?: TPostCollectionFilter;
	autoUpdate: boolean;
};

enum LoadRequestType {
	LOAD_NOT_NEEDED = 'LOAD_NOT_NEEDED',
	LOAD_ADDED = 'LOAD_ADDED',
	LOAD_UPDATED = 'LOAD_UPDATED',
	LOAD_ADDED_AND_UPDATED = 'LOAD_ADDED_AND_UPDATED',
}

export const PostCollection: FC<TPostCollectionProps> = ({
	headline,
	posts: initialPosts,
	canAdd = false,
	canLoadMore = false,
	filter = {},
}) => {
	const { data: session } = useSession();
	const { isActive: tabIsActive } = useActiveTabContext();

	const [postState, postDispatch] = useReducer(PCReducer, {
		...initialPCState,
		posts: initialPosts,
	});

	/**
	 *
	 * ============== LOAD MORE MECANISM ==============
	 *
	 */

	const [canLoadmore, setCanLoadmore] = useState(canLoadMore);

	const onLoadmoreBtn = async () => {
		// activate loading state
		postDispatch({ type: PCActionType.LOADING, payload: true });

		// fetch posts older than oldest post
		const { count: olderPostCount, posts: olderPosts } = await services.api.posts.loadmore({
			...filter,
			olderThan: getOldestPostId(),
		});

		// append older posts to list
		postDispatch({ type: PCActionType.POSTS_ADD, payload: olderPosts });

		// set canLoadmore to true if there are more posts available
		setCanLoadmore(olderPostCount > 0);

		// deactivate loading state
		postDispatch({ type: PCActionType.LOADING, payload: false });
	};

	/**
	 *
	 * ============== UPADTE MECANISM ==============
	 *
	 */

	const [loadRequest, setLoadRequest] = useState(LoadRequestType.LOAD_NOT_NEEDED);
	const [updateRequest, setUpdateRequest] = useState<
		| TActionType
		| {
				type: undefined;
		  }
	>({
		type: undefined,
	});

	useEffect(() => {
		// load full list of posts when user switches to browser tab
		if (!tabIsActive || loadRequest === LoadRequestType.LOAD_NOT_NEEDED) {
			setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);
			return;
		}

		const latestPostUlidDate = postState.posts?.length
			? postState.posts[0].id
			: encodeTime(new Date().getTime(), 10) + '0000000000000000';

		const oldestPostId = getOldestPostId();

		let requestObject = {
			...filter,
			olderThan: encodeTime(new Date().getTime(), 10) + '0000000000000000',
			newerThan: encodeTime(decodeTime(oldestPostId) - 1, 10) + oldestPostId.substring(26 - 16),
			limit: 100,
		};

		switch (loadRequest) {
			case LoadRequestType.LOAD_ADDED:
				// olderThan: current Date (to get latest posts)
				// newerThan: latest post id (to get all new posts)
				requestObject = {
					...requestObject,
					newerThan: latestPostUlidDate,
				};
				break;

			case LoadRequestType.LOAD_UPDATED:
				// olderThan: latest post id + 1 (to get all posts including the latest one)
				// newerThan: oldest post id - 1 (to get all posts including the oldest one)
				requestObject = {
					...requestObject,
					olderThan: encodeTime(decodeTime(latestPostUlidDate) + 1, 10) + latestPostUlidDate.substring(26 - 16),
				};
				break;

			case LoadRequestType.LOAD_ADDED_AND_UPDATED:
				// olderThan: current Date (to get latest posts)
				// newerThan: oldest post id - 1 (to get all posts including the oldest one)
				requestObject = {
					...requestObject,
					newerThan: encodeTime(decodeTime(oldestPostId) - 1, 10) + oldestPostId.substring(26 - 16),
				};
				break;

			default:
				break;
		}

		services.api.posts
			.loadmore(requestObject)
			.then((response) => {
				const { posts: newPosts } = response;

				// if no new posts are found, do nothing
				if (newPosts.length === 0) {
					setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);
					return;
				}

				// define action type for reducer (default: set posts for LOAD_ADDED_AND_UPDATED and LOAD_UPDATED)
				let updateActionType = PCActionType.POSTS_SET;

				// if only new posts are loaded, add them to the existing posts
				if (loadRequest === LoadRequestType.LOAD_ADDED) {
					updateActionType = PCActionType.POSTS_ADD;
				}

				// list of posts that have been deleted
				const deletedPostList = postState.posts.filter((post) => {
					return !newPosts.find((newPost) => newPost.id === post.id);
				});

				// get List of new Posts
				const newPostList = newPosts.filter((newPost) => {
					return !postState.posts.find((post) => post.id === newPost.id);
				});

				const postHaveChanged = deletedPostList.length > 0 || newPostList.length > 0;

				if (!postHaveChanged) {
					setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);
					return;
				}

				setUpdateRequest({
					payload: newPosts,
					type: updateActionType,
				});

				setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);
			})
			.catch((error) => {
				setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);
				console.error(error);
			});
	}, [loadRequest, tabIsActive]);

	const showLatestPosts = () => {
		if (!updateRequest.type) {
			return;
		}

		postDispatch(updateRequest);
		setUpdateRequest({ type: undefined });
	};

	/**
	 * LoadRequest if triggered by interval or by user switching to mumble browser tab
	 */

	useIncreasingInterval(() => {
		// only load new posts if browser tab is active
		if (!tabIsActive) return;

		// randomizes if load full list (to detect deleted posts) or check just for new posts (2/3 chance)
		// to prevent that all users load the full list at the same time when the interval is triggered
		// full list means to load all already visible posts
		// for our use case this is not necessary, but was fun to implement ;)

		const loadFullList = Math.random() > 0.66;
		setLoadRequest(loadFullList ? LoadRequestType.LOAD_UPDATED : LoadRequestType.LOAD_ADDED);
	});

	useEffect(() => {
		// load full list of posts when user switches to browser tab
		if (tabIsActive) {
			setLoadRequest(LoadRequestType.LOAD_ADDED_AND_UPDATED);
		}
	}, [tabIsActive]);

	/**
	 *
	 * ============== CRUD FUNCTIONS ==============
	 *
	 */

	const onAddPostFn = async (postData: TAddPostProps): Promise<TPost | null> => {
		const newPost = await services.posts.createPost({
			...postData,
			accessToken: session?.accessToken as string,
		});

		if (!newPost) return null;

		postDispatch({ type: PCActionType.POSTS_ADD, payload: newPost });

		return newPost;
	};

	const onRemovePostFn = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}
		postDispatch({ type: PCActionType.POSTS_DELETE, payload: id });
	};

	/**
	 *
	 * ============== HELPERS ==============
	 *
	 */

	const getOldestPostId = () => {
		const oldestPost = postState.posts[postState.posts.length - 1];
		return oldestPost ? oldestPost.id : encodeTime(new Date().getTime(), 10) + '0000000000000000';
	};

	return (
		<>
			{headline && (
				<div className="text-slate-500 mb-8">
					<Headline level={3} as="p">
						{headline}
					</Headline>
				</div>
			)}

			{canAdd && (
				<Grid variant="col" gap="M" marginBelow="M">
					<PostCreator
						variant="newPost"
						headline="Hey, was geht ab?"
						placeHolderText="Deine Meinung zählt"
						onAddPost={onAddPostFn}
					/>
				</Grid>
			)}

			{updateRequest.type && (
				<div className="text-slate-500 mb-8">
					<Button colorScheme="gradient" size="L" icon="repost" onClick={() => showLatestPosts()}>
						World is changing, update your feed.
					</Button>
				</div>
			)}

			<PostList posts={postState.posts} onRemovePost={onRemovePostFn} />

			{canLoadmore && (
				<Button colorScheme="slate" onClick={() => onLoadmoreBtn()} disabled={postState.loading}>
					{postState.loading ? '...' : 'Load more'}
				</Button>
			)}
		</>
	);
};
