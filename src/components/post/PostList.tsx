import { FC } from 'react';

import { Grid } from '@smartive-education/pizza-hawaii';
import { PostItem } from './PostItem';

import { TPost } from '../../types';
import { PostSkeleton } from '../helpers/PostSkeleton';

type TPostListProps = {
	posts?: TPost[];
	noPostsMessage?: string;
	onRemovePost: (id: string) => void;
	loadingItems?: number;
};

export const PostList: FC<TPostListProps> = ({
	posts,
	onRemovePost,
	loadingItems = 0,
	noPostsMessage = 'Keine Posts vorhanden.',
}) => {
	if (!posts?.length && loadingItems === 0) {
		return <p>{noPostsMessage}</p>;
	}

	return (
		<Grid variant="col" gap="M" marginBelow="M">
			{loadingItems > 0
				? Array.from(Array(loadingItems).keys()).map((i) => <PostSkeleton key={i} showImage={Math.random() > 0.5} />)
				: posts?.map((post: TPost) => {
						return <PostItem key={post.id} variant="timeline" post={post} onDeletePost={onRemovePost} />;
				  })}
		</Grid>
	);
};
