import { FC, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';

import { MainLayout } from '../../components/layoutComponents/MainLayout';

import { TPost } from '../../types';
import { services } from '../../services';
import { PostDetail } from '../../components/post/PostDetail';
import { TAddPostProps } from '../../components/post/PostCreator';

type TUserPage = {
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post: initialPost }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { data: session } = useSession();
	const router = useRouter();

	const [post, setPost] = useState(initialPost);

	const onAddReply = async (postData: TAddPostProps) => {
		const newReply = await services.posts.createPost({
			...postData,
			accessToken: session?.accessToken as string,
		});

		setPost((post: TPost) => ({
			...post,
			replies: [...(post.replies as TPost[]), newReply],
		}));

		return newReply;
	};

	const onRemovePost = async (id: string) => {
		const response = await services.api.posts.remove({ id });

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		if (post.id === id) {
			// go back to overview page
			router.push('/');
		} else {
			setPost((post: TPost) => ({
				...post,
				replies: post.replies?.filter((reply: TPost) => reply.id !== id) as TPost[],
			}));
		}
	};

	return (
		<MainLayout title={`Mumble von ${post?.user.userName}`} description={`Mumble von ${post?.user.userName}`}>
			<PostDetail post={post} onAddReply={onAddReply} onRemovePost={onRemovePost} />
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
