import { TUser } from './User';

export type TPost = {
	id: string;
	creator: string;
	text: string;
	mediaUrl?: string;
	mediaType: string;
	likeCount: number;
	likedByUser: boolean;
	replyCount?: number;
	createdAt: string;
	type: 'post' | 'reply';
	user: TUser;
	replies?: TPost[];
};
