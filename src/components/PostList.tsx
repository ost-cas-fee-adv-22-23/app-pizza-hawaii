import { FC } from 'react';

import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from './ContentCard';

import { TPost } from '../types';

type TPostListProps = {
	posts?: TPost[];
	noPostsMessage?: string;
	onRemovePost: (id: string) => void;
};

export const PostList: FC<TPostListProps> = ({ posts, onRemovePost, noPostsMessage = 'Keine Posts vorhanden.' }) => {
	if (!posts || posts.length === 0) {
		return <p>{noPostsMessage}</p>;
	}

	return (
		<Grid variant="col" gap="M" marginBelow="M">
			{posts?.map((post: TPost) => {
				return <ContentCard key={post.id} variant="timeline" post={post} onDeletePost={onRemovePost} />;
			})}
		</Grid>
	);
};
