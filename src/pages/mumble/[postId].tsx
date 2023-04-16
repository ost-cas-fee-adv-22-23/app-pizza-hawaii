import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ErrorPage from 'next/error';
import { getToken } from 'next-auth/jwt';
import React, { FC } from 'react';

import { MainLayout } from '../../components/layoutComponents/MainLayout';
import { PostDetail } from '../../components/post/PostDetail';
import { services } from '../../services';
import { TPost } from '../../types';

type TUserPage = {
	post: TPost;
	error?: string;
};

const DetailPage: FC<TUserPage> = ({ post, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	if (error) {
		return <ErrorPage statusCode={500} title={error} />;
	}

	return (
		<MainLayout
			title={`Mumble von ${post?.user.userName}`}
			seo={{
				description: `${post?.user.userName} schrieb: ${post?.text}`,
				image: { url: post?.mediaUrl, type: post?.mediaType },
				pageType: 'article',
			}}
		>
			<PostDetail post={post} />
		</MainLayout>
	);
};

export default DetailPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query: { postId } }) => {
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
