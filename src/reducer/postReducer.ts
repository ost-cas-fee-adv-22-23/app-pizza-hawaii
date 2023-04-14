import { TPost } from '../types';

export enum PostActionType {
	LOADING = 'LOADING',
	POSTS_ADD = 'POSTS_ADD',
	POSTS_DELETE = 'POSTS_DELETE',
	POSTS_UPDATE = 'POSTS_UPDATE',
	POSTS_SET = 'POSTS_SET',
}

export type TPostAction =
	| { type: PostActionType.LOADING; payload: boolean }
	| { type: PostActionType.POSTS_ADD; payload: TPost | TPost[] }
	| { type: PostActionType.POSTS_DELETE; payload: string }
	| { type: PostActionType.POSTS_UPDATE; payload: TPost }
	| { type: PostActionType.POSTS_SET; payload: TPost[] };

type TPostState = {
	posts: TPost[];
	loading: boolean;
};

export const initialState: TPostState = {
	posts: [],
	loading: false,
};

export default function postReducer(state = initialState, action: TPostAction) {
	switch (action.type) {
		case PostActionType.LOADING: {
			return {
				...state,
				loading: action.payload,
			};
		}

		case PostActionType.POSTS_SET: {
			return {
				...state,
				loading: false,
				posts: action.payload,
			};
		}
		case PostActionType.POSTS_ADD: {
			// add new posts to the existing posts
			const allPosts = [...state.posts, ...(Array.isArray(action.payload) ? action.payload : [action.payload])];

			// remove duplicates
			const uniquePosts = allPosts.filter((post, index) => {
				return allPosts.findIndex((p) => p.id === post.id) === index;
			});

			// sort by date
			uniquePosts.sort((a, b) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});

			return {
				...state,
				loading: false,
				posts: uniquePosts,
			};
		}

		case PostActionType.POSTS_DELETE: {
			return {
				...state,
				loading: false,
				posts: state.posts.filter((post) => post.id !== action.payload),
			};
		}

		case PostActionType.POSTS_UPDATE: {
			return {
				...state,
				loading: false,
				posts: state.posts.map((post) => {
					if (post.id === action.payload.id) {
						return action.payload;
					}
					return post;
				}),
			};
		}

		default:
			return state;
	}
}
