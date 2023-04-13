import { TPost } from '../types';

export type TPostAction =
	| { type: 'posts/fetch' }
	| { type: 'posts/add'; payload: TPost | TPost[] }
	| { type: 'posts/remove'; payload: string }
	| { type: 'posts/update'; payload: TPost }
	| { type: 'posts/set'; payload: TPost[] };

type TPostState = {
	posts: TPost[];
	loading: boolean;
};

export const initialState: TPostState = {
	posts: [],
	loading: false,
};

export default function appReducer(state = initialState, action: TPostAction) {
	switch (action.type) {
		case 'posts/fetch': {
			return {
				...state,
				loading: true,
			};
		}

		case 'posts/set': {
			return {
				...state,
				loading: false,
				posts: action.payload,
			};
		}
		case 'posts/add': {
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

		case 'posts/remove': {
			return {
				...state,
				loading: false,
				posts: state.posts.filter((post) => post.id !== action.payload),
			};
		}

		case 'posts/update': {
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
