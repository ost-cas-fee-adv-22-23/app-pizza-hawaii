import { Button, Grid, Headline } from '@smartive-education/pizza-hawaii';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useReducer, useState } from 'react';

import { useActiveTabContext } from '../../context/useActiveTab';
import useIncreasingInterval from '../../hooks/useIncreasingInterval';
import PCReducer, {
	ActionType as PCActionType,
	initialState as initialPCState,
	TActionType,
} from '../../reducer/postCollectionReducer';
import { services } from '../../services';
import { TPost } from '../../types';
import { default as ULID } from '../../utils/UlidHelper';
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
	canLoadMore: boolean;
	filter?: TPostCollectionFilter;
	autoUpdate?: boolean;
};

enum LoadRequestType {
	LOAD_NOT_NEEDED = 'LOAD_NOT_NEEDED',
	LOAD_ADDED = 'LOAD_ADDED',
	LOAD_UPDATED = 'LOAD_UPDATED',
	LOAD_ADDED_AND_UPDATED = 'LOAD_ADDED_AND_UPDATED',
}

type TLoadRequestType = keyof typeof LoadRequestType;

export const PostCollection: FC<TPostCollectionProps> = ({
	headline,
	posts: initialPosts = [],
	canAdd = false,
	canLoadMore = false,
	autoUpdate,
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
	 * ============== LOAD MORE MECHANISM ==============
	 *
	 */

	const [canLoadmore, setCanLoadmore] = useState(canLoadMore);

	const onLoadmoreBtn = async () => {
		// activate loading state
		postDispatch({ type: PCActionType.LOADING, payload: true });

		// fetch posts older than oldest post
		const { count: olderPostCount, posts: olderPosts } = await services.api.posts.loadmore({
			...filter,
			olderThan: getPostQueryUlids(postState.posts).oldestUlid,
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
	 * ============== UPDATE MECHANISM ==============
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

	const onLoadRequestLoad = async (requestObject: TRequestObj) => {
		// fetch posts older than oldest post
		const { posts: loadedPosts } = await services.api.posts.loadmore({
			...filter,
			...requestObject,
		});

		if (!loadedPosts?.length) {
			return {
				posts: [],
				newPosts: [],
				deletedPosts: [],
			};
		}

		// list of posts that have been deleted
		const deletedPostList = postState.posts.filter((post) => {
			return !loadedPosts.find((p) => p.id === post.id);
		});

		// get List of new Posts
		const newPostList = loadedPosts.filter((post) => {
			return !postState.posts.find((p) => p.id === post.id);
		});

		return {
			posts: loadedPosts,
			newPosts: newPostList,
			deletedPosts: deletedPostList,
		};
	};

	useEffect(() => {
		// check not needed because loadRequest is set to LOAD_NOT_NEEDED
		if (loadRequest === LoadRequestType.LOAD_NOT_NEEDED) {
			return;
		}

		// reset loadRequest to LOAD_NOT_NEEDED
		setLoadRequest(LoadRequestType.LOAD_NOT_NEEDED);

		// generate request object from loadRequest and filter
		const requestObject = {
			...filter,
			...getRequestObj(postState.posts, loadRequest),
		};

		(async () => {
			const { posts, newPosts, deletedPosts } = await onLoadRequestLoad(requestObject);

			// if no new or deleted posts are found, do nothing
			if (newPosts.length === 0 && deletedPosts.length === 0) {
				setUpdateRequest({ type: undefined });
				return;
			}

			// define action type for reducer (default: set posts for LOAD_ADDED_AND_UPDATED and LOAD_UPDATED)
			let updateActionType = PCActionType.POSTS_SET;

			// if only new posts are loaded, add them to the existing posts
			if (loadRequest === LoadRequestType.LOAD_ADDED) {
				updateActionType = PCActionType.POSTS_ADD;
			}

			setUpdateRequest({
				payload: posts,
				type: updateActionType,
			});
		})();

		// We only want to trigger this effect when one of the values changes: loadRequest and filter
		// so we disable the exhaustive-deps rule here. Otherwise the effect would be triggered multiple times which is not intended.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadRequest, filter]);

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
		// only load new posts if browser tab is active and autoUpdate is enabled
		if (!tabIsActive || !autoUpdate) return;

		// randomizes if load full list (to detect deleted posts) or check just for new posts (2/3 chance)
		// to prevent that all users load the full list at the same time when the interval is triggered
		// full list means to load all already visible posts
		// for our use case this is not necessary, but was fun to implement ;)

		const loadFullList = Math.random() > 0.66;
		setLoadRequest(loadFullList ? LoadRequestType.LOAD_UPDATED : LoadRequestType.LOAD_ADDED);
	});

	useEffect(() => {
		// only load new posts if browser tab is active and autoUpdate is enabled
		if (!tabIsActive || !autoUpdate) return;

		// load full list of posts when user switches to browser tab
		setLoadRequest(LoadRequestType.LOAD_ADDED_AND_UPDATED);
	}, [tabIsActive, autoUpdate]);

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
						textAreaId="post-creator"
						variant="newPost"
						headline="Hey, was geht ab?"
						placeHolderText="Deine Meinung zählt"
						onAddPost={onAddPostFn}
					/>
				</Grid>
			)}
			<div>
				<PostList posts={postState.posts} onRemovePost={onRemovePostFn} showLoadingItems={3} />

				{canLoadmore && (
					<Button colorScheme="slate" onClick={onLoadmoreBtn} disabled={postState.loading}>
						{postState.loading ? 'loading ...' : 'Load more'}
					</Button>
				)}

				{autoUpdate && updateRequest.type && (
					<div className="text-slate-500 mt-8 sticky bottom-4 z-10">
						<Button colorScheme="gradient" size="M" icon="repost" onClick={showLatestPosts}>
							World is changing, update your feed.
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

/**
 *
 * ============== HELPERS ==============
 *
 */

// generate request object for posts
type TRequestObj = {
	limit: number;
	olderThan: string;
	newerThan: string;
};
const getRequestObj = (posts: TPost[], loadRequest: TLoadRequestType) => {
	const { currentUlid, oldestUlid, latestUlid } = getPostQueryUlids(posts);

	// default request object (olderThan: current Date, newerThan: oldest post id - 1, limit: 100) to get all posts
	let requestObject = {
		limit: 100,
	} as TRequestObj;

	switch (loadRequest) {
		case LoadRequestType.LOAD_ADDED:
			// olderThan: current Date (to get latest posts)
			// newerThan: latest post id (to get all new posts)
			requestObject = {
				...requestObject,
				olderThan: currentUlid,
				newerThan: latestUlid,
			};
			break;

		case LoadRequestType.LOAD_UPDATED:
			// olderThan: latest post id + 1 (to get all posts including the latest one)
			// newerThan: oldest post id - 1 (to get all posts including the oldest one)
			requestObject = {
				...requestObject,
				olderThan: ULID.getNewerThan(latestUlid),
				newerThan: ULID.getOlderThan(oldestUlid),
			};
			break;

		case LoadRequestType.LOAD_ADDED_AND_UPDATED:
			// olderThan: current Date (to get latest posts)
			// newerThan: oldest post id - 1 (to get all posts including the oldest one)
			requestObject = {
				...requestObject,
				olderThan: currentUlid,
				newerThan: ULID.getOlderThan(oldestUlid),
			};
			break;

		default:
			break;
	}

	return requestObject;
};

// get oldest post id
const getPostQueryUlids = (posts: TPost[]) => {
	const currentUlid = ULID.getCurrent();

	// check if posts are available
	if (!posts?.length) {
		return {
			currentUlid,
			latestUlid: currentUlid,
			oldestUlid: currentUlid,
		};
	}

	const latestPost = posts[0];
	const oldestPost = posts[posts.length - 1];

	return {
		currentUlid,
		latestUlid: latestPost.id,
		oldestUlid: oldestPost.id,
	};
};
