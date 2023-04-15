import { TPost } from '../types';

export enum ActionType {
	LOADING = 'LOADING',
	POSTS_ADD = 'POSTS_ADD',
	POSTS_DELETE = 'POSTS_DELETE',
	POSTS_UPDATE = 'POSTS_UPDATE',
	POSTS_SET = 'POSTS_SET',
}

export type TActionType =
	| { type: ActionType.LOADING; payload: boolean }
	| { type: ActionType.POSTS_ADD; payload: TPost | TPost[] }
	| { type: ActionType.POSTS_DELETE; payload: string | string[] }
	| { type: ActionType.POSTS_UPDATE; payload: TPost | TPost[] }
	| { type: ActionType.POSTS_SET; payload: TPost[] };

type TPostState = {
	posts: TPost[];
	loading: boolean;
};

export const initialState: TPostState = {
	posts: [],
	loading: false,
};

export default function postCollectionReducer(state = initialState, action: TActionType) {
	switch (action.type) {
		case ActionType.LOADING: {
			return {
				...state,
				loading: action.payload,
			};
		}

		case ActionType.POSTS_SET: {
			return {
				...state,
				loading: false,
				posts: action.payload,
			};
		}
		case ActionType.POSTS_ADD: {
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

		case ActionType.POSTS_DELETE: {
			return {
				...state,
				loading: false,
				posts: state.posts.filter((post) => {
					return !Array.isArray(action.payload) ? post.id !== action.payload : !action.payload.includes(post.id);
				}),
			};
		}

		case ActionType.POSTS_UPDATE: {
			return {
				...state,
				loading: false,
				posts: state.posts.map((post) => {
					if (Array.isArray(action.payload)) {
						const updatedPost = action.payload.find((p) => p.id === post.id);
						return updatedPost ? updatedPost : post;
					}
					return post.id === action.payload.id ? action.payload : post;
				}),
			};
		}

		default:
			return state;
	}
}
