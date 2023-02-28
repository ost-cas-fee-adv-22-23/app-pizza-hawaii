import { usersService } from './users';
import { postsService } from './posts';
import { likesService } from './likes';

export const services = {
	users: usersService,
	posts: postsService,
	likes: likesService,
};
