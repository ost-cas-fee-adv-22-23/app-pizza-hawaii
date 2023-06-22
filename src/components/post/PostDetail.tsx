import { Grid } from '@smartive-education/pizza-hawaii';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FC, useReducer } from 'react';

import PDReducer, { ActionType as PDActionType, initialState as initialPDState } from '../../reducer/postDetailReducer';
import { services } from '../../services';
import { TPost, TUser } from '../../types';
import { PostCreator, TAddPostProps } from './PostCreator';
import { PostItem } from './PostItem';
import { PostList } from './PostList';

type TPostDetailProps = {
	post: TPost;
	canWrite?: boolean;
};

export const PostDetail: FC<TPostDetailProps> = ({ post, canWrite }) => {
	const [postState, postDispatch] = useReducer(PDReducer, {
		...initialPDState,
		...post,
	});

	const router = useRouter();
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const textAreaId = `post-${post?.id}-reply`;

	const onAddReply = async (postData: TAddPostProps) => {
		const newReply = await services.posts.createPost({
			...postData,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			accessToken: session?.accessToken as string,
		});

		postDispatch({ type: PDActionType.REPLY_ADD, payload: newReply });

		return newReply;
	};

	const onRemovePost = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		if (postState.id === id) {
			// go back to overview page
			router.push('/');
		} else {
			postDispatch({ type: PDActionType.REPLY_DELETE, payload: id });
		}
	};

	const onAnswerPost = (id: string) => {
		const answerPost = post.id === id ? post : postState.replies?.find((reply) => reply.id === id);

		const textarea = document.getElementById(textAreaId) as HTMLTextAreaElement;
		if (!textarea) {
			return;
		}

		// scroll to textarea
		textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });

		// focus textarea
		textarea?.focus();

		// add markdownLink to PostCreator textarea
		const markdownLink = `@[${answerPost?.user?.userName}|${answerPost?.user?.id}]`;

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
			{post && <PostItem variant="detailpage" post={post} onDeletePost={onRemovePost} onAnswerPost={onAnswerPost} />}

			{currentUser && canWrite && (
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

			{postState.replies && (
				<PostList
					posts={postState.replies}
					variant="response"
					onRemovePost={onRemovePost}
					onAnswerPost={onAnswerPost}
					noPostsMessage={false}
				/>
			)}
		</Grid>
	);
};
