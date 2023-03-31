import React, { FC, useEffect, useState } from 'react';

import { Grid, Button, Headline } from '@smartive-education/pizza-hawaii';
import { ContentCard } from './ContentCard';
import { ContentInput, TAddPostProps } from './ContentInput';

import { TPost, TUser } from '../types';
import { useSession } from 'next-auth/react';

type TPostCollection = {
	headline: string;
	posts: TPost[];
	canAdd: boolean;
	canLoadmore: boolean;
	onAddPost: (data: TAddPostProps) => TPost;
	onRemovePost: (id: string) => void;
	onLoadmore: () => TPost[];
};

export const PostCollection: FC<TPostCollection> = ({
	headline,
	posts,
	canAdd,
	canLoadmore,
	onAddPost,
	onRemovePost,
	onLoadmore,
}) => {
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const [visiblePosts, setVisiblePosts] = useState(posts);
	const [hasUpdate, setHasUpdate] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// check if post was added since last render
		const newPosts = posts.filter((post) => !visiblePosts.includes(post));

		// check if post was removed since last render
		const removedPosts = visiblePosts.filter((post) => !posts.includes(post));

		// if there are new or removed posts, show update button
		if ([...newPosts, ...removedPosts].length > 0) {
			// if there are changed posts, show update button
			setHasUpdate(true);

			// show list of changed posts
			setVisiblePosts(posts);
		}
	}, [posts, visiblePosts]);

	const showLatestPosts = () => {
		// show all posts
		setVisiblePosts(posts);

		// hide update button
		setHasUpdate(false);
	};

	const onLoadmoreBtn = async () => {
		setLoading(true);
		if (onLoadmore) {
			const morePosts = await onLoadmore();
			setVisiblePosts((currentVisiblePosts) => [...currentVisiblePosts, ...morePosts]);
		}
		setLoading(false);
	};

	const onAddPostFn = async (data: TAddPostProps) => {
		const newPost = await onAddPost(data);
		setVisiblePosts((currentVisiblePosts) => [newPost, ...currentVisiblePosts]);
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

			{hasUpdate && (
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
				{visiblePosts?.map((post: TPost) => {
					return <ContentCard key={post.id} variant="timeline" post={post} onDeletePost={onRemovePost} />;
				})}
			</Grid>

			{canLoadmore && (
				<Button colorScheme="slate" onClick={() => onLoadmoreBtn()} disabled={loading}>
					{loading ? '...' : 'Load more'}
				</Button>
			)}
		</section>
	);
};
