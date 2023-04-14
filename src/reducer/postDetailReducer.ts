// import emtyPost
import { postsService } from '../services/posts';
import { TPost } from '../types';

export enum ActionType {
	LOADING = 'LOADING',
	COMMENT_ADD = 'COMMENT_ADD',
	COMMENT_DELETE = 'COMMENT_DELETE',
	COMMENT_UPDATE = 'COMMENT_UPDATE',
}

export type TActionType =
	| { type: ActionType.LOADING; payload: boolean }
	| { type: ActionType.COMMENT_ADD; payload: TPost }
	| { type: ActionType.COMMENT_DELETE; payload: string }
	| { type: ActionType.COMMENT_UPDATE; payload: TPost };

type TPostState = TPost & {
	replies: TPost[];
	loading: boolean;
};

export const initialState: TPostState = {
	...postsService.emptyPost(''),
	replies: [],
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

		case ActionType.COMMENT_ADD: {
			const allReplies = [...state.replies, action.payload];

			// remove duplicates
			const uniqueReply = allReplies.filter((reply, index) => {
				return allReplies.findIndex((p) => p.id === reply.id) === index;
			});

			// sort by date
			uniqueReply.sort((a, b) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});

			return {
				...state,
				loading: false,
				replies: uniqueReply,
			};
		}

		case ActionType.COMMENT_DELETE: {
			console.log(action.payload, state.replies);
			return {
				...state,
				loading: false,
				replies: state.replies.filter((reply) => reply.id !== action.payload),
			};
		}

		case ActionType.COMMENT_UPDATE: {
			return {
				...state,
				loading: false,
				replies: state.replies.map((reply) => {
					if (reply.id === action.payload.id) {
						return action.payload;
					}
					return reply;
				}),
			};
		}

		default:
			return state;
	}
}
