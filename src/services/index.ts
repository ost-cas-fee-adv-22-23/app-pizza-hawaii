import { apiService } from './api';
import { usersService } from './users';
import { postsService } from './posts';
import { likesService } from './likes';
// import { postReply } from './postReply';

export const services = {
	api: apiService,
	users: usersService,
	posts: postsService,
	likes: likesService,
};
