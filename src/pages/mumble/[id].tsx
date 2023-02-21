import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { services } from '../../services';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Grid, Button } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import type TPost from '../../services/index';
import { ContentInput } from '../../components/ContentInput';
import { TUser } from '../../services/users';
import { contentCardModel } from '../../models/ContentCard';

type DetailPageProps = {
	postDataId: string;
	createdAt: string;
	creator: string;
	postId: string;
	likeCount: number;
	likedByUser: boolean;
	mediaUrl: string;
	replyCount: number;
	text: string;
	type: string;
	avatarUrl: string;
	firstName: string;
	UserId: string;
	lastName: string;
	userName: string;
	replyCounter: number;
};

export default function DetailPage(props: DetailPageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
	// console.log('%c[id].tsx line:16 postData', 'color: white; background-color: #007acc;', props);
	const { text, firstName } = props;
	const { data: session } = useSession();

	const author = {
		firstName: session?.user.firstName,
		lastName: session?.user.lastName,
		userName: session?.user.userName,
		profileLink: `/user/${session?.user.id}`,
		id: session?.user.id,
	};

	

	const loadResponses = async (id: string) => {
		const replies = await services.posts.getRepliesById(id);
	};

	const loadUser = async (creator: string, token: string) => {
		const userData = await services.posts.getUserbyPostId(creator, token);
		return userData;
	};

	return (
		<div className="bg-slate-400">
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="response" post={props} />
					<ContentInput
						variant="answerPost"
						headline="Hey, was geht ab?"
						author={author} //TODO better model for author
						placeHolderText="Deine Meinung zählt"
					/>
					<h1>Mumble post ID: {props.postDataId}</h1>
					text:{text} <br />
					firstname:{firstName} <br />
					reply replyCount: {props.replyCount} <br />
					<button onClick={() => loadResponses(props.postDataId)}>are there replys?</button>
					<button onClick={() => loadUser(props.creator, session?.accessToken)}>userData</button>
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
		const userData: TUser = await services.posts.getUserbyPostId(postData.creator, session?.accessToken);

		return {
			props: contentCardModel(postData, userData),
		};
	} catch (error) {
		throw new Error('getUserByPostId: No valid UserId was provided');
	}
};
