import { apiService } from './api';
import { likesService } from './likes';
import { postsService } from './posts';
import { usersService } from './users';

export const services = {
	api: apiService,
	users: usersService,
	posts: postsService,
	likes: likesService,
};
