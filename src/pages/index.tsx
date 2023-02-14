import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid } from '@smartive-education/pizza-hawaii';

import { fetchMumbles, fetchUsers, Mumble } from '../services/qwacker';
import User from './../data/user.json';
import { useState } from 'react';

type PageProps = {
	count: number;
	mumbles: Mumble[];
	error?: string;
};

export default function PageHome({
	count,
	mumbles: initialMumbles,
	error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [mumbles, setMumbles] = useState(initialMumbles);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialMumbles.length < count);

	if (error) {
		return <div>An error occurred: {error}</div>;
	}

	const loadMore = async () => {
		const { count, mumbles: newMumbles } = await fetchMumbles({
			limit: 5,
			offset: mumbles.length,
		});

		setLoading(false);
		setHasMore(mumbles.length + newMumbles.length < count);
		setMumbles([...mumbles, ...newMumbles]);
	};
	const user = {
		...User,
		profileLink: `user/${User.userName}`,
	};

	return (
		<div className="bg-slate-100">
			<Header user={user} />
			<main className="px-content">
				<section className="mx-auto w-full max-w-content">
					<div className="mb-2 text-violet-600">
						<Headline level={2}>Welcome to Storybook</Headline>
					</div>

					<div className="text-slate-500 mb-8">
						<Headline level={4} as="p">
							Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
						</Headline>
					</div>

					<Grid variant="col" gap="M" marginBelow="M">
						<ContentInput
							variant="newPost"
							headline="Hey, was geht ab?"
							author={user}
							placeHolderText="Deine Meinung zählt"
						/>

						{mumbles.map((mumble) => {
							return <ContentCard key={mumble.id} variant="timeline" post={mumble} />;
						})}
					</Grid>

					{hasMore ? (
						<button
							onClick={() => loadMore()}
							disabled={loading}
							className="bg-indigo-400 px-2 py-1 rounded-lg mt-4"
						>
							{loading ? '...' : 'Load more'}
						</button>
					) : (
						''
					)}
				</section>
			</main>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
	//const { data: token } = useSession();
	try {
		const { count, mumbles } = await fetchMumbles({ limit: 5 });
		const { users } = await fetchUsers({
			accessToken: '',
		});
		console.log(users);
		return {
			props: {
				count,
				mumbles: mumbles.map((mumble) => {
					const author = users.find((user) => user.id === mumble.creator);
					if (author) {
						mumble.creator = author;
					}
					return mumble;
				}),
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = String(error);
		}

		return { props: { error: message, mumbles: [], count: 0 } };
	}
};
