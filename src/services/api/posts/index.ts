import { get } from './get';
import { like, unlike } from './like';
import { loadmore } from './loadmore';
import { create } from './create';
// remove this when the create is working
import { reply } from './reply';

export const postsService = {
	get,
	loadmore,
	like,
	unlike,
	reply,
	create,
};
