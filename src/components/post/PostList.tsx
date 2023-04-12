import { Grid } from '@smartive-education/pizza-hawaii';
import { FC } from 'react';

import { TPost } from '../../types';
import { PostSkeleton } from '../helpers/PostSkeleton';
import { PostItem, TPostItemProps } from './PostItem';

type TPostListProps = {
	posts?: TPost[];
	variant?: TPostItemProps['variant'];
	noPostsMessage?: string;
	loadingItems?: number;
	onRemovePost: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

export const PostList: FC<TPostListProps> = ({
	posts,
	variant = 'timeline',
	loadingItems = 0,
	noPostsMessage = 'Keine Posts vorhanden.',
	onRemovePost,
	onAnswerPost,
}) => {
	if (!posts?.length && loadingItems === 0) {
		return <p>{noPostsMessage}</p>;
	}

	return (
		<Grid variant="col" gap="M" marginBelow="M">
			{loadingItems > 0
				? Array.from(Array(loadingItems).keys()).map((i) => <PostSkeleton key={i} showImage={Math.random() > 0.5} />)
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
