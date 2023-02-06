import { GetServerSideProps, InferGetStaticPropsType } from 'next';

import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid } from '@smartive-education/pizza-hawaii';

import User from '../data/user.json';
import { Post as PostType } from '../types/Post';

type PageProps = {
	posts: {
		data: PostType[];
	};
};

export default function PageHome({ posts }: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
	const user = {
		...User,
		profileLink: `user/${User.userName}`,
	};

	const Posts = posts.data;

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

						{Posts &&
							Posts.sort((a: PostType, b: PostType) => {
								return new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1;
							}).map((post) => {
								return <ContentCard key={post.id} variant="timeline" post={post} />;
							})}
					</Grid>
				</section>
			</main>
		</div>
	);
}
export const getServerSideProps: GetServerSideProps = async () => ({
	props: { posts: require('../data/posts.json') },
});
