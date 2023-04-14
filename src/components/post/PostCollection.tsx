import { Button, Grid, Headline } from '@smartive-education/pizza-hawaii';
import { FC, useEffect, useReducer, useState } from 'react';

import PCReducer, { ActionType as PCActionType, initialState as initialPCState } from '../../reducer/postCollectionReducer';
import { TPost } from '../../types';
import { PostList } from '../post/PostList';
import { PostCreator, TAddPostProps } from './PostCreator';

type TPostCollectionProps = {
	headline?: string;
	posts: TPost[];
	canAdd?: boolean;
	canLoadmore?: boolean;
	onAddPost?: (data: TAddPostProps) => Promise<TPost | null>;
	onRemovePost?: (id: string) => void;
	onLoadmore?: () => Promise<TPost[]>;
};

export const PostCollection: FC<TPostCollectionProps> = ({
	headline,
	posts,
	canAdd = false,
	canLoadmore = false,
	onAddPost,
	onRemovePost,
	onLoadmore,
}) => {
	const [postState, postDispatch] = useReducer(PCReducer, {
		...initialPCState,
		posts,
	});
	const [hasUpdate, setHasUpdate] = useState(false);

	useEffect(() => {
		const { posts } = postState;
		// Check if there are new or removed posts
		const newPosts = posts.filter((post) => !posts.includes(post));
		const removedPosts = posts.filter((post) => !posts.includes(post));

		setHasUpdate([...newPosts, ...removedPosts].length > 0);
		// TODO: this is a question we have and we await the answer for that. adding state is not a solution.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [posts]);

	const showLatestPosts = () => {
		postDispatch({ type: PCActionType.POSTS_SET, payload: posts });
	};

	const onLoadmoreBtn = async () => {
		if (!onLoadmore) return;

		postDispatch({ type: PCActionType.LOADING, payload: true });

		const morePosts = await onLoadmore();
		postDispatch({ type: PCActionType.LOADING, payload: false });
		postDispatch({ type: PCActionType.POSTS_ADD, payload: morePosts });
	};

	const onRemovePostFn = (id: string) => {
		if (!onRemovePost) return;

		onRemovePost(id);
		postDispatch({ type: PCActionType.POSTS_DELETE, payload: id });
	};

	const onAddPostFn = async (data: TAddPostProps) => {
		if (!onAddPost) return null;

		const newPost = await onAddPost(data);
		if (!newPost) return null;
		postDispatch({ type: PCActionType.POSTS_ADD, payload: newPost });

		return newPost;
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

			{hasUpdate && (
				<div className="text-slate-500 mb-8">
					<Button colorScheme="gradient" size="L" icon="repost" onClick={() => showLatestPosts()}>
						World is changing, update your feed.
					</Button>
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

			<PostList posts={postState.posts} onRemovePost={onRemovePostFn} />

			{canLoadmore && (
				<Button colorScheme="slate" onClick={() => onLoadmoreBtn()} disabled={postState.loading}>
					{postState.loading ? '...' : 'Load more'}
				</Button>
			)}
		</>
	);
};
