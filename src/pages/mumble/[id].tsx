import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import { ContentInput } from '../../components/ContentInput';
import { contentCardModel } from '../../models/ContentCard';
import { Header } from '../../components/Header';

import { TPost, TUser } from '../../types';

import { services } from '../../services';

type TUserPage = {
	currentUser: TUser;
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post, currentUser }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

	return (
		<div className="bg-slate-100">
			<Header user={currentUser} />
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="response" post={post} />

					<ContentInput
						variant="answerPost"
						headline="Hey, was meinst Du dazu?"
						author={currentUser}
						replyTo={post}
						placeHolderText="Deine Antwort...?"
					/>
				</Grid>
			</section>
		</div>
	);
};

export default DetailPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
	const session = await getToken({ req });
	if (!session) {
		return {
			props: { userData: null, error: 'not logged in, no session' },
		};
	}
	try {
		const postData: TPost = await services.posts.getPostById({
			id: id as string,
			accessToken: session?.accessToken as string,
		});

		const userData: TUser = await services.users.getUserbyPostId({
			id: postData.creator as string,
			accessToken: session?.accessToken as string,
		});

		return {
			props: {
				post: contentCardModel(postData, userData),
				currentUser: session?.user,
			},
		};
	} catch (error) {
		console.log(error);
		throw new Error('getUserByPostId: No valid UserId was provided');
	}
};
