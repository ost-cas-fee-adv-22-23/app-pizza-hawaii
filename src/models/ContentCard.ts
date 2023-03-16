import { TPost, TUser } from '../types';

type TContentCard = {
	post: TPost;
	user: TUser;
	replies?: TPost[];
};

function contentCardModel(props: TContentCard): TPost | null {
	const { post, user, replies } = props;

	if (!post || !user) return null;

	return {
		...post,
		replies: replies || [],
		creator: user,
	} as TPost;
}

export { contentCardModel };
