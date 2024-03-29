import { Grid } from '@smartive-education/pizza-hawaii';
import { FC } from 'react';

import { TPost } from '../../types';
import { PostItem, TPostItemProps } from './PostItem';
import { PostSkeleton } from './PostSkeleton';

type TPostListProps = {
	posts: TPost[];
	variant?: TPostItemProps['variant'];
	noPostsMessage?: boolean | string;
	showLoadingItems?: number;
	onRemovePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

export const PostList: FC<TPostListProps> = ({
	posts = [],
	variant = 'timeline',
	showLoadingItems = 0,
	noPostsMessage = 'Keine Posts vorhanden.',
	onRemovePost,
	onAnswerPost,
}) => {
	if (noPostsMessage && posts?.length === 0) {
		return <p data-testid="no-posts-available-message">{noPostsMessage}</p>;
	}
	// if there are no posts yet, show skeletons
	return (
		<Grid variant="col" gap="M" marginBelow="M">
			{!posts && showLoadingItems > 0
				? Array.from(Array(showLoadingItems).keys()).map((i) => <PostSkeleton key={i} showImage={i % 2 === 1} />)
				: posts?.map((post: TPost) => {
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
