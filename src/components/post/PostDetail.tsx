import { Grid } from '@smartive-education/pizza-hawaii';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

import { TPost, TUser } from '../../types';
import { PostCreator, TAddPostProps } from './PostCreator';
import { PostItem } from './PostItem';
import { PostList } from './PostList';

type TPostDetailProps = {
	post: TPost;
	replies?: TPost[];
	onRemovePost?: (id: string) => void;
	onAddReply?: (data: TAddPostProps) => Promise<TPost | null>;
};

export const PostDetail: FC<TPostDetailProps> = ({ post, replies, onRemovePost, onAddReply }) => {
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const textAreaId = `post-${post?.id}-reply`;

	const onAnswerPost = (id: string) => {
		const anserPost = replies?.find((reply) => reply.id === id);

		const textarea = document.getElementById(textAreaId) as HTMLTextAreaElement;
		if (!textarea) {
			return;
		}

		// scroll to textarea
		textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });

		// focus textarea
		textarea?.focus();

		// add markdownLink to PostCreator textarea
		const markdownLink = `@[${anserPost?.user?.userName}|${anserPost?.user?.id}]`;

		// set text to textarea and prepend markdownLink and check if there is already a text then add a space
		textarea?.setRangeText(
			`${textarea?.nodeValue ? ' ' : ''}${markdownLink} `,
			textarea.selectionStart,
			textarea.selectionEnd,
			'end'
		);
	};

	return (
		<Grid as="div" variant="col" gap="S">
			{post && <PostItem variant="detailpage" post={post} onDeletePost={onRemovePost} />}

			{currentUser && onAddReply && (
				<Grid variant="col" gap="M" marginBelow="M">
					<PostCreator
						textAreaId={textAreaId}
						variant="answerPost"
						headline="Hey, was meinst Du dazu?"
						replyTo={post}
						placeHolderText="Deine Antwort...?"
						onAddPost={onAddReply}
					/>
				</Grid>
			)}

			{replies && (
				<PostList posts={replies} variant="response" onRemovePost={onRemovePost} onAnswerPost={onAnswerPost} />
			)}
		</Grid>
	);
};
