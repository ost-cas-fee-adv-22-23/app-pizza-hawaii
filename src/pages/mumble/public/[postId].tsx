import { Grid, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import router from 'next/router';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';

import { MainLayout } from '../../../components/layoutComponents/MainLayout';
import { PostDetail } from '../../../components/post/PostDetail';
import { services } from '../../../services';
import { TPost, TUser } from '../../../types';

type TUserPage = {
	post: TPost;
};

const DetailPage: FC<TUserPage> = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const [counter, setCounter] = useState(7);

	useEffect(() => {
		if (currentUser) {
			if (counter > 0) {
				const timer = setInterval(() => setCounter(counter - 1), 1000);
				return () => clearInterval(timer);
			} else {
				router.push(`/mumble/${post.id}`);
			}
		}
	}, [counter, currentUser, post.id]);

	// TODO: If loggein user should get redirected from middleware (nice to have)

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
						{currentUser ? (
							<>
								<Label as="p" size="L">
									Hallo{' '}
									<span className="text-violet-600 dark:text-violet-200">{currentUser.userName}</span>, du
									bist bereits angemeldet.
								</Label>
								<Label as="p" size="L">
									{counter > 0 ? (
										<>
											Du wirst in{' '}
											<span className="text-violet-600 dark:text-violet-200">{counter} Sekunden</span>{' '}
											automatisch weitergeleitet.
										</>
									) : (
										'Du wirst jetzt weitergeleitet.'
									)}
								</Label>
								<Link href={`/mumble/${post.id}`} component={NextLink}>
									Weiter
								</Link>
							</>
						) : (
							<>
								<Label as="p" size="L">
									Registriere dich jetzt und werde Teil unserer Community.
								</Label>
								<Link href="/auth/signup" component={NextLink}>
									Jetzt registrieren
								</Link>
							</>
						)}
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
