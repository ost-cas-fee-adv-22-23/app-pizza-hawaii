import { Grid, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import { FC } from 'react';

import { MainLayout } from '../../../components/layout/MainLayout';
import { PostDetail } from '../../../components/post/PostDetail';
import { services } from '../../../services';
import { TPost } from '../../../types';

type TUserPage = {
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
	return (
		<MainLayout
			title={`Mumble von ${post?.user.userName}`}
			seo={{
				description: `${post?.user.userName} schrieb: ${post?.text}`,
				image: { url: post?.mediaUrl as string, type: post?.mediaType },
				pageType: 'article',
			}}
		>
			<>
				<div className="mb-6 text-violet-600">
					<Headline level={1} as="h1">
						Welcome to Mumble
					</Headline>
				</div>
				<div className="text-slate-500 mb-8">
					<Grid variant="col" gap="M">
						<Label as="p" size="XL">
							Als angemeldeter Nutzer kannst du Beiträge lesen, eigene Beiträge erstellen, auf andere Beiträge
							antworten und anderen Nutzern folgen.
						</Label>
						<Label as="p" size="L">
							Registriere dich jetzt und werde Teil unserer Community.
						</Label>
						<Link href="/auth/signup" component={NextLink}>
							Jetzt registrieren
						</Link>
					</Grid>
				</div>
				<PostDetail post={post} canWrite={false} />

				{(post?.replyCount || 0) + (post?.likeCount || 0) > 0 && (
					<div className="text-slate-500 mt-8">
						<Label as="p" size="L">
							{(post?.replyCount || 0) + (post?.likeCount || 0) < 5
								? 'Dieser Mumble hat bereits einige Reaktionen. '
								: `Dieser Mumble ist sehr beliebt. `}
							Melde dich an, um nichts zu verpassen!
						</Label>
					</div>
				)}
			</>
		</MainLayout>
	);
};

export default DetailPage;

export const getStaticProps: GetStaticProps<{ post: TPost }> = async (context) => {
	const postId = context.params?.postId;

	try {
		const post: TPost = await services.posts.getPost({
			id: postId as string,
			loadReplies: false,
		});

		return {
			props: {
				post,
			},
			revalidate: 60, // 60 seconds
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

export const getStaticPaths = async (): Promise<{ paths: { params: { id: string } }[]; fallback: string }> => {
	return {
		paths: [],
		fallback: 'blocking', // wait for data to be fetched
	};
};
