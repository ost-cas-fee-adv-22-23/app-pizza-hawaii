import firstPostMock from '../../__mocks__/firstPost.json';
import secondPostMock from '../../__mocks__/secondPost.json';
import postCollectionReducer, { ActionType, initialState } from '../../reducer/postCollectionReducer';
import { TPost } from '../../types';

describe('postCollectionReducer', () => {
	// test the LOADING action
	it('should handle LOADING action', () => {
		const postState = postCollectionReducer(initialState, { type: ActionType.LOADING, payload: !initialState.loading });

		expect(postState).toEqual({
			...initialState,
			loading: !initialState.loading,
		});
	});

	// test the POSTS_SET action with an array of posts
	it('should handle POSTS_SET action', () => {
		const postsToAdd = [firstPostMock, secondPostMock] as TPost[];

		const postState = postCollectionReducer(initialState, {
			type: ActionType.POSTS_SET,
			payload: postsToAdd,
		});

		expect(postState.posts).toEqual(postsToAdd);
	});

	// test the POSTS_ADD action with antoher post
	it('should handle POSTS_ADD action', () => {
		const existingPosts = [firstPostMock] as TPost[];
		const newPost = secondPostMock as TPost;

		const postState = postCollectionReducer(
			{
				...initialState,
				posts: existingPosts,
			},
			{
				type: ActionType.POSTS_ADD,
				payload: newPost,
			}
		);

		expect(postState.posts).toEqual([...existingPosts, newPost]);
	});

	// test the POSTS_DELETE action with a given post id
	it('should handle POSTS_DELETE action', () => {
		const existingPosts = [firstPostMock, secondPostMock] as TPost[];
		const postIdToDelete = firstPostMock.id as string;

		const postState = postCollectionReducer(
			{
				...initialState,
				posts: existingPosts,
			},
			{
				type: ActionType.POSTS_DELETE,
				payload: postIdToDelete,
			}
		);

		expect(postState.posts).toEqual([secondPostMock]);
	});

	it('should handle POSTS_UPDATE action', () => {
		const existingPosts = [firstPostMock, secondPostMock] as TPost[];
		const postToUpdate = {
			...firstPostMock,
			likeCount: 27,
		} as TPost;

		const postState = postCollectionReducer(
			{
				...initialState,
				posts: existingPosts,
			},
			{
				type: ActionType.POSTS_UPDATE,
				payload: postToUpdate,
			}
		);

		expect(postState.posts).toEqual([postToUpdate, secondPostMock]);
	});
});
