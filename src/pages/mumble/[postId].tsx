import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import React, { FC } from 'react';

import { MainLayout } from '../../components/layout/MainLayout';
import { PostDetail } from '../../components/post/PostDetail';
import { services } from '../../services';
import { TPost } from '../../types';

type TUserPage = {
	post: TPost;
	error?: string;
};

const DetailPage: FC<TUserPage> = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<MainLayout
			title={`Mumble von ${post?.user.userName}`}
			seo={{
				description: `${post?.user.userName} schrieb: ${post?.text}`,
				image: { url: post?.mediaUrl, type: post?.mediaType },
				pageType: 'article',
			}}
		>
			<PostDetail post={post} canWrite={true} />
		</MainLayout>
	);
};

export default DetailPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query: { postId } }) => {
	const session = await getToken({ req });
	const accessToken = session?.accessToken as string;

	try {
		const post: TPost = await services.posts.getPost({
			id: postId as string,
			loadReplies: true,
			accessToken,
		});

		return {
			props: {
				post,
				session,
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = 'An error occurred while loading the data.';
		}

		throw new Error(message);
	}
};
