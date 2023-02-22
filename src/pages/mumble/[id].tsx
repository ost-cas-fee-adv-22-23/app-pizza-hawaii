import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { services } from '../../services';
import { getToken } from 'next-auth/jwt';
import { Grid } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import { ContentInput } from '../../components/ContentInput';
import { contentCardModel } from '../../models/ContentCard';
import { Header } from '../../components/Header';
import { TPost, TUser } from '../../types';

export default function DetailPage({ post, currentUser }): InferGetServerSidePropsType<typeof getServerSideProps> {
	console.log('%c[id].tsx line:16 postData', 'color: white; background-color: #007acc;', post);

	console.log('currentUser', currentUser);
	return (
		<div className="bg-slate-100">
			<Header user={currentUser} />
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="response" post={post} />

					<ContentInput
						variant="answerPost"
						headline="Hey, was geht ab?"
						author={currentUser}
						placeHolderText="Deine Meinung zählt"
					/>
				</Grid>
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
	const session = await getToken({ req });
	if (!session) {
		return {
			props: { userData: null, error: 'not logged in, no session' },
		};
	}
	try {
		const postData: TPost = await services.posts.getPostById(id);
		const userData: TUser = await services.users.getUserbyPostId(postData.creator, session?.accessToken);

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
