import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import { ContentInput } from '../../components/ContentInput';
import { MainLayout } from '../../components/layoutComponents/MainLayout';

import { TPost, TUser } from '../../types';

import { services } from '../../services';

type TUserPage = {
	currentUser: TUser;
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post, currentUser }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<MainLayout>
			<>
				<Grid as="div" variant="col" gap="S">
					{post && <ContentCard variant="detailpage" post={post} canDelete={post.creator === currentUser.id} />}
					{currentUser && (
						<ContentInput
							variant="answerPost"
							headline="Hey, was meinst Du dazu?"
							author={currentUser}
							replyTo={post}
							placeHolderText="Deine Antwort...?"
						/>
					)}
					{post?.replies?.map((reply: TPost) => {
						return (
							<ContentCard
								key={reply.id}
								variant="response"
								post={reply}
								canDelete={reply.creator === currentUser.id}
							/>
						);
					})}
				</Grid>
			</>
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
