import { get } from './get';
import { like } from './like';
import { unlike } from './unlike';
import { loadmore } from './loadmore';
import { reply } from './reply';

export const postsService = {
	get,
	loadmore,
	like,
	unlike,
	reply,
};
