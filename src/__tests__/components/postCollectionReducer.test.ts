import postCollectionReducer, { initialState, ActionType } from '../../reducer/postCollectionReducer';
import firstPostMock from '../../__mocks__/firstPost.json';
import secondPostMock from '../../__mocks__/secondPost.json';

jest.mock('next-auth/react');

describe('the postCollectionReducer should', () => {
	it('return initial state if new state is undefined', () => {
		const newState = postCollectionReducer(undefined, {});
		expect(newState).toEqual(initialState);
	});

	it('should handle LOADING action', () => {
		const action = { type: ActionType.LOADING, payload: true };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.loading).toBe(true);
	});

	it('should handle POSTS_SET action', () => {
		const posts = [firstPostMock, secondPostMock];
		const action = { type: ActionType.POSTS_SET, payload: posts };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.posts).toEqual(posts);
		expect(newState.loading).toBe(false);
	});

	it('should handle POSTS_ADD action', () => {
		const existingPosts = [firstPostMock];
		const newPost = secondPostMock;
		const action = { type: ActionType.POSTS_ADD, payload: newPost };
		const state = { ...initialState, posts: existingPosts };
		const newState = postCollectionReducer(state, action);
		expect(newState.posts).toEqual([...existingPosts, newPost]);
		expect(newState.loading).toBe(false);
	});

	it('should handle POSTS_DELETE action', () => {
		const existingPosts = [firstPostMock, secondPostMock];
		const postIdToDelete = '01GZFZES838XW8SV8QVWCJSN6C';
		const action = { type: ActionType.POSTS_DELETE, payload: postIdToDelete };
		const state = { ...initialState, posts: existingPosts };
		const newState = postCollectionReducer(state, action);
		expect(newState.posts).toEqual([secondPostMock]);
		expect(newState.loading).toBe(false);
	});
});
