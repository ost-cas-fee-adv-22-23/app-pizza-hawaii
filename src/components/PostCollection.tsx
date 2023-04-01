import { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Grid, Button, Headline } from '@smartive-education/pizza-hawaii';
import { ContentInput, TAddPostProps } from './ContentInput';

import { TPost, TUser } from '../types';
import { PostList } from './PostList';

type TPostCollectionProps = {
	headline?: string;
	posts: TPost[];
	canAdd?: boolean;
	canLoadmore?: boolean;
	onAddPost?: (data: TAddPostProps) => Promise<TPost | null>;
	onRemovePost?: (id: string) => void;
	onLoadmore?: () => Promise<TPost[]>;
};

type TPostCollectionState = {
	visiblePosts: TPost[];
	hasUpdate: boolean;
	loading: boolean;
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
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const [state, setState] = useState<TPostCollectionState>({
		visiblePosts: posts,
		hasUpdate: false,
		loading: false,
	});

	useEffect(() => {
		const { visiblePosts } = state;
		// Check if there are new or removed posts
		const newPosts = posts.filter((post) => !visiblePosts.includes(post));
		const removedPosts = visiblePosts.filter((post) => !posts.includes(post));

		setState((prevState) => ({ ...prevState, hasUpdate: [...newPosts, ...removedPosts].length > 0 }));
	}, [posts, state.visiblePosts]);

	const showLatestPosts = () => {
		setState((prevState) => ({ ...prevState, hasUpdate: false, visiblePosts: posts }));
	};

	const onLoadmoreBtn = async () => {
		if (!onLoadmore) return;
		setState((prevState) => ({ ...prevState, loading: true }));
		const morePosts = await onLoadmore();
		setState((prevState) => ({
			...prevState,
			visiblePosts: [...prevState.visiblePosts, ...morePosts],
			loading: false,
		}));
	};

	const onRemovePostFn = (id: string) => {
		if (!onRemovePost) return;

		onRemovePost(id);

		setState((prevState) => ({
			...prevState,
			visiblePosts: prevState.visiblePosts.filter((post) => post.id !== id),
		}));
	};

	const onAddPostFn = async (data: TAddPostProps) => {
		if (!onAddPost) return null;

		const newPost = await onAddPost(data);

		if (!newPost) return null;

		setState((prevState) => ({
			...prevState,
			visiblePosts: [newPost, ...prevState.visiblePosts],
		}));

		return newPost;
	};

	return (
		<section>
			{headline && (
				<div className="text-slate-500 mb-8">
					<Headline level={3} as="p">
						{headline}
					</Headline>
				</div>
			)}

			{state.hasUpdate && (
				<div className="text-slate-500 mb-8">
					<Button colorScheme="gradient" size="L" icon="repost" onClick={() => showLatestPosts()}>
						World is changing, update your feed.
					</Button>
				</div>
			)}

			<Grid variant="col" gap="M" marginBelow="M">
				{canAdd && currentUser && (
					<ContentInput
						variant="newPost"
						headline="Hey, was geht ab?"
						author={currentUser}
						placeHolderText="Deine Meinung zählt"
						onAddPost={onAddPostFn}
					/>
				)}
				<PostList posts={state.visiblePosts} onRemovePost={onRemovePostFn} />
			</Grid>

			{canLoadmore && (
				<Button colorScheme="slate" onClick={() => onLoadmoreBtn()} disabled={state.loading}>
					{state.loading ? '...' : 'Load more'}
				</Button>
			)}
		</section>
	);
};
