import { decodeTime } from 'ulid';

export type ContentCardModel = {
	postDataId: string;
	createdAt: string;
	creator: string;
	postId: string;
	likeCount: number;
	likedByUser: boolean;
	mediaUrl: string;
	replyCount: number;
	text: string;
	type: string;
	avatarUrl: string;
	firstName: string;
	UserId: string;
	lastName: string;
	userName: string;
}

export const contentCardModel = (postData?: any, userData?: any): ContentCardModel | undefined => {
	if (!postData || !userData) return undefined;

	return {
		postDataId: postData.id,
		createdAt: new Date(decodeTime(postData.id)).toISOString(),
		creator: postData.creator,
		postId: postData.id,
		likeCount: postData.likeCount,
		likedByUser: postData.likedByUser,
		mediaUrl: postData.mediaUrl,
		replyCount: postData.replyCount,
		text: postData.text,
		type: postData.type,
		avatarUrl: userData.avatarUrl,
		firstName: userData.firstName,
		UserId: userData.id,
		lastName: userData.lastName,
		userName: userData.userName,
	};
};
