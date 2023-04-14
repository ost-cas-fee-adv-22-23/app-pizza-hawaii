// import emtyPost
import { postsService } from '../services/posts';
import { TPost } from '../types';

export enum ActionType {
	LOADING = 'LOADING',
	REPLY_ADD = 'REPLY_ADD',
	REPLY_DELETE = 'REPLY_DELETE',
	REPLY_UPDATE = 'REPLY_UPDATE',
	LIKE_TOGGLE = 'LIKE_TOGGLE',
}

export type TActionType =
	| { type: ActionType.LOADING; payload: boolean }
	| { type: ActionType.REPLY_ADD; payload: TPost }
	| { type: ActionType.REPLY_DELETE; payload: string }
	| { type: ActionType.REPLY_UPDATE; payload: TPost }
	| { type: ActionType.LIKE_TOGGLE; payload?: undefined };

type TPostState = TPost & {
	replies: TPost[];
	replyCount: number;
	likeCount: number;
	loading: boolean;
};

export const initialState: TPostState = {
	...postsService.emptyPost(''),
	replies: [],
	replyCount: 0,
	likeCount: 0,
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

		case ActionType.REPLY_ADD: {
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
				replyCount: uniqueReply.length,
			};
		}

		case ActionType.REPLY_DELETE: {
			const newReplyList = state.replies.filter((reply) => reply.id !== action.payload);
			return {
				...state,
				loading: false,
				replies: newReplyList,
				replyCount: newReplyList.length,
			};
		}

		case ActionType.REPLY_UPDATE: {
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

		case ActionType.LIKE_TOGGLE: {
			const likeCount = state.likeCount || 0;
			const likedByUser = state.likedByUser || false;
			return {
				...state,
				loading: false,
				likeCount: likedByUser ? likeCount - 1 : likeCount + 1,
				likedByUser: !likedByUser,
			};
		}

		default:
			return state;
	}
}
