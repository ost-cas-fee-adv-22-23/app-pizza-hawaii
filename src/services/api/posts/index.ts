import { get } from './get';
import { remove } from './remove';
import { like, unlike } from './like';
import { loadmore } from './loadmore';

export const postsService = {
	get,
	remove,
	loadmore,
	like,
	unlike,
};
