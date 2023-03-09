import { get } from './get';
import { like } from './like';
import { unlike } from './unlike';
import { loadmore } from './loadmore';
import { postReply } from './postReply';

export const postsService = {
	get,
	loadmore,
	like,
	unlike,
	postReply,
};
