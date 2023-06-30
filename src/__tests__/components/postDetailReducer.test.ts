import postCollectionReducer, { ActionType } from '../../reducer/postCollectionReducer';

describe('the postCollectionReducer should', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	// test the initial state of the reducer
	test('should set loading flag to true', () => {
		const initialState = { loading: false };
		const action = { type: ActionType.LOADING, payload: true };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.loading).toBe(true);
	});

	// test tje default case of the reducer for unknown action types
	test('should return current state for unknown action type', () => {
		const initialState = { loading: false };
		const action = { type: 'UNKNOWN_ACTION', payload: true };
		const newState = postCollectionReducer(initialState, action);
		expect(newState).toEqual(initialState);
	});

	// test the REPLY_UPDATE action to update a specific reply
	test('should update a specific reply', () => {
		const reply1 = { id: '1', text: 'Reply 1' };
		const reply2 = { id: '2', text: 'Reply 2' };
		const initialState = { replies: [reply1, reply2] };
		const updatedReply = { id: '1', text: 'Reply 1' };
		const action = { type: ActionType.REPLY_UPDATE, payload: updatedReply };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.replies.find((reply) => reply.id === '1')).toEqual(updatedReply);
	});
});
