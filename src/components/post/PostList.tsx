import { Grid } from '@smartive-education/pizza-hawaii';
import { FC, useEffect, useState } from 'react';

import { TPost } from '../../types';
import { PostSkeleton } from '../helpers/PostSkeleton';
import { PostItem, TPostItemProps } from './PostItem';

type TPostListProps = {
	posts: TPost[];
	variant?: TPostItemProps['variant'];
	noPostsMessage?: string;
	// loadingItems?: number;
	onRemovePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

// TODO: is loadingItems still needed? or can we replace skeletonArray with loadingItems?

export const PostList: FC<TPostListProps> = ({
	posts,
	variant = 'timeline',
	noPostsMessage = 'Keine Posts vorhanden.',
	onRemovePost,
	onAnswerPost,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [showPosts, setShowPosts] = useState<TPost[]>([]);
	const skeletonArray = [1, 2, 3];

	useEffect(() => {
		setTimeout(() => {
			setShowPosts(posts);
			setIsLoading(false);
		}, 500);
	}, [posts]);

	if (!showPosts.length && !isLoading) {
		return <p>{noPostsMessage}</p>;
	}

	return (
		<Grid variant="col" gap="M" marginBelow="M">
			{isLoading
				? skeletonArray.map((i) => <PostSkeleton key={i} />)
				: showPosts.map((post: TPost) => {
						return (
							<PostItem
								key={post.id}
								variant={variant}
								post={post}
								onDeletePost={onRemovePost}
								onAnswerPost={onAnswerPost}
							/>
						);
				  })}
		</Grid>
	);
};
