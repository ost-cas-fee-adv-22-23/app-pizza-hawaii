import firstPostMock from '../../__mocks__/firstPost.json';
import secondPostMock from '../../__mocks__/secondPost.json';
import postCollectionReducer, { ActionType, initialState } from '../../reducer/postCollectionReducer';

jest.mock('next-auth/react');

describe('the postCollectionReducer should', () => {
	// test the initial state of the reducer
	it('return initial state if new state is undefined', () => {
		const newState = postCollectionReducer(undefined, {});
		expect(newState).toEqual(initialState);
	});

	// test the LOADING action
	it('should handle LOADING action', () => {
		const action = { type: ActionType.LOADING, payload: true };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.loading).toBe(true);
	});

	// test the POSTS_SET action with an array of posts
	it('should handle POSTS_SET action', () => {
		const posts = [firstPostMock, secondPostMock];
		const action = { type: ActionType.POSTS_SET, payload: posts };
		const newState = postCollectionReducer(initialState, action);
		expect(newState.posts).toEqual(posts);
		expect(newState.loading).toBe(false);
	});

	// test the POSTS_ADD action with antoher post
	it('should handle POSTS_ADD action', () => {
		const existingPosts = [firstPostMock];
		const newPost = secondPostMock;
		const action = { type: ActionType.POSTS_ADD, payload: newPost };
		const state = { ...initialState, posts: existingPosts };
		const newState = postCollectionReducer(state, action);
		expect(newState.posts).toEqual([...existingPosts, newPost]);
		expect(newState.loading).toBe(false);
	});

	// test the POSTS_DELETE action with a given post id
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
