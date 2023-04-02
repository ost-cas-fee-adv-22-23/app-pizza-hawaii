import { FC } from 'react';

import { Grid } from '@smartive-education/pizza-hawaii';
import { PostItem } from './PostItem';
import { PostCreator, TAddPostProps } from './PostCreator';

import { TPost } from '../../types';
import { PostList } from './PostList';

type TPostDetailProps = {
	post: TPost;
	onRemovePost: (id: string) => void;
	onAddReply: (data: TAddPostProps) => Promise<TPost | null>;
};

export const PostDetail: FC<TPostDetailProps> = ({ post, onRemovePost, onAddReply }) => {
	return (
		<Grid as="div" variant="col" gap="S">
			<PostItem variant="detailpage" post={post} onDeletePost={onRemovePost} />

			<Grid variant="col" gap="M" marginBelow="M">
				<PostCreator
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
