import { Headline } from '@smartive-education/pizza-hawaii';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import React, { FC, useState } from 'react';

import { MainLayout } from '../../components/layout/MainLayout';
import { PostList } from '../../components/post/PostList';
import { services } from '../../services';
import { TPost } from '../../types';

type TUserPage = {
	searchTag: string;
	posts: TPost[];
};

const DetailPage: FC<TUserPage> = ({
	searchTag,
	posts: initialPosts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [posts, setPosts] = useState(initialPosts);
	console.log('posts', posts);
	return (
		<MainLayout
			title={`Posts zum Thema "${searchTag}"`}
			seo={{
				description: `Posts zum Thema "${searchTag}"`,
			}}
		>
			<>
				<div className="mb-8 text-violet-600">
					<Headline level={2}>
						Posts zum Thema <span className="mb-8 text-slate-900 dark:text-slate-200">#{searchTag}</span>
					</Headline>
				</div>

				<PostList
					posts={posts}
					onRemovePost={(id: string): void => {
						setPosts((posts: TPost[]) => posts.filter((post: TPost) => post.id !== id));
					}}
				/>
			</>
		</MainLayout>
	);
};

export default DetailPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query: { tag: searchTag } }) => {
	const session = await getToken({ req });
	const accessToken = session?.accessToken as string;

	try {
		const { count, posts } = await services.posts.getPostsByQuery({
			tags: [searchTag as string],
			accessToken,
		});

		return {
			props: {
				session,
				searchTag,
				count,
				posts,
			},
		};
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = 'An error occurred while loading the data.';
		}

		throw new Error(message);
	}
};
