import { FC } from 'react';

import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from './ContentCard';
import { ContentInput, TAddPostProps } from './ContentInput';

import { TPost } from '../types';
import { PostList } from './PostList';

type TPostDetailProps = {
	post: TPost;
	onRemovePost: (id: string) => void;
	onAddReply: (data: TAddPostProps) => Promise<TPost | null>;
};

export const PostDetail: FC<TPostDetailProps> = ({ post, onRemovePost, onAddReply }) => {
	return (
		<Grid as="div" variant="col" gap="S">
			<ContentCard variant="detailpage" post={post} onDeletePost={onRemovePost} />

			<Grid variant="col" gap="M" marginBelow="M">
				<ContentInput
					variant="answerPost"
					headline="Hey, was meinst Du dazu?"
					replyTo={post}
					placeHolderText="Deine Antwort...?"
					onAddPost={onAddReply}
				/>
			</Grid>

			<PostList posts={post?.replies} onRemovePost={onRemovePost} />
		</Grid>
	);
};
