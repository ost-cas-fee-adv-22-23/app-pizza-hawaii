import { postsService } from './posts/';
import { usersService } from './users/';

export const apiService = {
	posts: postsService,
	users: usersService,
};
