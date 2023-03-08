import { TPost, TUser } from '../types';

type TContentCard = {
	post: TPost;
	user: TUser;
	replies?: TPost[];
};

export const contentCardModel: TContentCard = (props: TContentCard): TPost | undefined => {
	const { post, user, replies } = props;

	if (!post || !user) return undefined;

	return {
		...post,
		replies: replies || [],
		creator: user,
	};
};
