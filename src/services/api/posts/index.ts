import { get } from './get';
import { like, unlike } from './like';
import { loadmore } from './loadmore';
import { remove } from './remove';

export const postsService = {
	get,
	remove,
	loadmore,
	like,
	unlike,
};
