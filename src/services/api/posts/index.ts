import { get } from './get';
import { like, unlike } from './like';
import { loadmore } from './loadmore';
import { reply } from './reply';

export const postsService = {
	get,
	loadmore,
	like,
	unlike,
	reply,
};
