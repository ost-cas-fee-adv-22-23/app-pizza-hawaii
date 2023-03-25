import { FC, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import { ContentInput, TAddPostProps } from '../../components/ContentInput';
import { MainLayout } from '../../components/layoutComponents/MainLayout';

import { TPost, TUser } from '../../types';
import { services } from '../../services';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type TUserPage = {
	currentUser: TUser;
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post, currentUser }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { data: session } = useSession();
	const router = useRouter();

	const onAddReply = async (postData: TAddPostProps) => {
		try {
			const newReply = await services.posts.createPost({
				...postData,
				accessToken: session?.accessToken as string,
			});

			post.replies = [newReply, ...post.replies];
		} catch (error) {
			console.error('onSubmitHandler: error', error);
		}
	};

	const onRemovePost = async (id: string) => {
		try {
			const result = await services.api.posts.remove({ id });

			if (result) {
				if (post.id === id) {
					// go back to overview page
					router.push('/');
				} else {
					post.replies = post.replies.filter((reply: TPost) => reply.id !== id);
				}
			}
		} catch (error) {
			console.error('onSubmitHandler: error', error);
		}
	};

	return (
		<MainLayout title={`Mumble von ${post?.user.userName}`} description={`Mumble von ${post?.user.userName}`}>
			<Grid as="div" variant="col" gap="S">
				{post && (
					<ContentCard
						variant="detailpage"
						post={post}
						canDelete={post.creator === currentUser.id}
						onDeletePost={onRemovePost}
					/>
				)}
				{currentUser && (
					<ContentInput
						variant="answerPost"
						headline="Hey, was meinst Du dazu?"
						author={currentUser}
						replyTo={post}
						placeHolderText="Deine Antwort...?"
						onAddPost={onAddReply}
					/>
				)}
				{post?.replies?.map((reply: TPost) => {
					return (
						<ContentCard
							key={reply.id}
							variant="response"
							post={reply}
							canDelete={reply.creator === currentUser.id}
							onDeletePost={onRemovePost}
						/>
					);
				})}
			</Grid>
		</MainLayout>
	);
};

export default DetailPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id: postId } }) => {
	const session = await getToken({ req });
	if (!session) {
		return {
			props: { userData: null, error: 'not logged in, no session' },
		};
	}
	try {
		const post: TPost = await services.posts.getPost({
			id: postId as string,
			loadReplies: true,
			accessToken: session?.accessToken as string,
		});

		return {
			props: {
				post,
				currentUser: session?.user,
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = String(error);
		}

		return { props: { error: message } };
	}
};
