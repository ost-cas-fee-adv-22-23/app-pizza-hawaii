import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { services } from '../../services';

import type TPost from '../../services/index';

type Props = {
	mumble: {
		id: string;
		data: TPost;
	};
};

export default function MumblePage({ mumble }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [loading, setLoading] = useState(false);
	const { data, id } = mumble
	console.log('%c[id].tsx line:16 data', 'color: white; background-color: #007acc;', data);

	return loading ? (
		<>loading...</>
	) : (
		<>
			<h1>Mumble post ID: {data.id}</h1>
			<h2>here comes all content of that entry</h2>
			text:{data.text} <br />
			reply counter: {data.replyCount} <br />
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
	const res = await services.posts.getPostById(id!);
	const data = await res;

	return {
		props: {
			mumble: { id, data },
		},
	};
};
