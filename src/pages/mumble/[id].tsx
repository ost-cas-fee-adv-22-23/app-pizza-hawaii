import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { services } from '../../services';

import { Grid, Button } from '@smartive-education/pizza-hawaii';
import { ContentCard } from '../../components/ContentCard';
import type TPost from '../../services/index';
import { ContentInput } from '../../components/ContentInput';

type Props = {
	mumble: {
		id: string;
		data: TPost;
	};
};

export default function MumblePage({ mumble }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [loading, setLoading] = useState(false);
	const { data, id } = mumble;

	const loadResponses = async (id: string) => {
		const replies = await services.posts.getRepliesById(id);
		console.log('replyies:', replies);
	};
	console.log('%c[id].tsx line:16 data', 'color: white; background-color: #007acc;', data);

	return (
		<div className="bg-slate-400">
			<section className="mx-auto w-full max-w-content">
				<Grid as="div" variant="col" gap="S">
					<ContentCard variant="response" post={data} />
					<ContentInput
						variant="answerPost"
						headline="Hey, was geht ab?"
						author="hoi"
						placeHolderText="Deine Meinung zählt"
					/>
					<h1>Mumble post ID: {data.id}</h1>
					<h2>here comes all content of that entry</h2>
					text:{data.text} <br />
					reply counter: {data.replyCount} <br />
					<button onClick={() => loadResponses(data.id)}>are there replys?</button>
				</Grid>
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
	const res = await services.posts.getPostById(id);
	const data = await res;

	return {
		props: {
			mumble: { id, data },
		},
	};
};
