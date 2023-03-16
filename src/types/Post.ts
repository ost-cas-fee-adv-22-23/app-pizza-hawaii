import { TUser } from './User';

export type TPost = {
	id: string;
	creator: TUser | string;
	text: string;
	mediaUrl?: string | null;
	mediaType: 'image/jpeg';
	likeCount: number;
	likedByUser: boolean | string;
	replyCount?: number;
	createdAt: string;
	type: 'post' | 'reply' | 'deleted';
	replies?: TPost[];
};
