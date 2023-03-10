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
	console.log('%c[id].tsx line:16 postData', 'color: white; background-color: #007acc;', post);

	console.log('currentUser', currentUser);
	console.log('post', post);
	return (
		<div className="bg-slate-100">
			<Header user={currentUser} />
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="detailpage" post={post} />

					<ContentInput
						variant="answerPost"
						headline="Hey, was geht ab?"
						author={currentUser}
						placeHolderText="Deine Meinung zählt"
					/>
					{post?.replies?.map((reply: TPost) => {
						console.log(reply);
						return <ContentCard key={reply.id} variant="response" post={reply} />;
					})}
				</Grid>
			</section>
		</div>
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
		const postData: TPost = await services.posts.getPostById({
			id: postId as string,
			accessToken: session?.accessToken as string,
		});

		const repliesData = await services.posts.getRepliesById({
			id: postId as string,
			accessToken: session?.accessToken as string,
		});

		console.log('repliesData', repliesData);

		const { users } = await services.users.getUsers({
			accessToken: session?.accessToken as string,
		});

		const user = (users.find((user) => user.id === postData.creator) as TUser) || null;

		const replies = repliesData
			.map((post) => {
				const author = users.find((user: TUser) => user.id === post.creator);
				if (author) {
					post.creator = author;
				}
				return post;
			})
			.filter((post) => typeof post.creator === 'object');

		return {
			props: {
				post: contentCardModel({
					post: postData,
					user: user,
					replies,
				}),
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
