import { User } from './User';

export type Post = {
	id: string;
	creator: User;
	text: string;
	mediaUrl?: string | null;
	mediaType: 'image/jpeg';
	likeCount: number;
	likedByUser: boolean | string;
	replyCount: number;
	createdAt: string;
	type: 'post';
};
