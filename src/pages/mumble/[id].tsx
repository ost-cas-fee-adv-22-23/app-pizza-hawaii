import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { services } from '../../services';
import { useSession } from 'next-auth/react';
import { Grid, Button } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import type TPost from '../../services/index';
import { ContentInput } from '../../components/ContentInput';

type Props = {
	mumble: {
		id: string;
		postData: TPost;
	};
};

export default function MumblePage({ mumble }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [loading, setLoading] = useState(false);
	const { data: session } = useSession();


	const { postData, id } = mumble;
	console.log('%c[id].tsx line:21 accessToken', 'color: white; background-color: #007acc;', session);
	const loadResponses = async (id: string) => {
		const replies = await services.posts.getRepliesById(id);
	};

	const loadUser = async (creator: string, token: string) => {
		const userData = await services.posts.getUserbyPostId(creator, token);
		console.log('%c[id].tsx line:16 userData', 'color: white; background-color: #f3f;', userData);
		return userData;
	};

	console.log('%c[id].tsx line:16 postData', 'color: white; background-color: #007acc;', postData);

	return (
		<div className="bg-slate-400">
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="response" post={postData} />
					<ContentInput
						variant="answerPost"
						headline="Hey, was geht ab?"
						author='me'
						placeHolderText="Deine Meinung zählt"
					/>
					<h1>Mumble post ID: {postData.id}</h1>
					<h2>here comes all content of that entry</h2>
					text:{postData.text} <br />
					reply counter: {postData.replyCount} <br />
					<button onClick={() => loadResponses(postData.id)}>are there replys?</button>
					<button onClick={() => loadUser(postData.creator, session?.accessToken)}>userData</button>
				</Grid>
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
	const res = await services.posts.getPostById(id);
	const postData = await res;

	return {
		props: {
			mumble: { id, postData },
		},
	};
};
