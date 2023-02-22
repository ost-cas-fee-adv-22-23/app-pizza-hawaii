import { decodeTime } from 'ulid';
import { TPost } from '../services/posts';
import { TUser } from '../services/users';

export type ContentCardModel = {
	post: TPost;
	creator: TUser;
};

export const contentCardModel = (postData?: any, userData?: any): ContentCardModel | undefined => {
	if (!postData || !userData) return undefined;

	return {
		post: postData,
		creator: userData,
	};
};
