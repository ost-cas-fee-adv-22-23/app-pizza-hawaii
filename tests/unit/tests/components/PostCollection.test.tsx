import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import mockLoadedPosts from '../../../../tests/unit/mocks/loadedPosts.json';
import { PostCollection } from '../../../../src/components/post/PostCollection';
import { PostList } from '../../../../src/components/post/PostList';
import { TPost } from '../../../../src/types/Post';

/**
 * Unit tests for the PostCollection and PostList components.
 *
 * These components are re-used a lot in our Application and represent the core-functionality of our app.
 * So it is important to test them thoroughly.
 * We test the following on PostCollection
 * 1. Render the PostCollection component with text
 * 2. Render the the load more Button if `canLoadMore` is true
 * 3. Do not render the button if `canLoadMore` is false
 * 4. Render the PostCreator component if `canAdd` is true with a send button
 * 5. `Not` render the PostCreator component if `canAdd` is false (user is not logged in)
 * 6. Not render a message to the user if there are no Posts available
 * 7. Render the PostCollection component with a filter of userId
 *
 * We test the following on PostList
 * 1. Render PostList component with text
 * 2. Render an empty PostList component with a feedback text if no Posts are loaded
 *
 **/

jest.mock('next-auth/react');

describe('PostCollection Component input rendering', () => {
	const loadedPosts = mockLoadedPosts as TPost[];

	afterAll(cleanup);
	// test if PostCollection component renders correctly
	it('should render the PostCollection component with text', () => {
		const mockSession = {
			user: { name: 'Filiks Adamski', email: 'filiks.adamski@mumble.com' },
			expires: '1234567890',
		};
		(useSession as jest.Mock).mockReturnValue([mockSession, true]);

		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={loadedPosts}
				canLoadMore={true}
				canAdd={true}
				autoUpdate={true}
			/>
		);
		expect(screen.getByText('Deine Meinung zählt'));
	});

	// test if PostCollection component renders correctly
	it('should render the the load more Button if `canLoadMore` is true', () => {
		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={loadedPosts}
				canLoadMore={true}
				canAdd={true}
				autoUpdate={true}
			/>
		);
		expect(screen.getByRole('button', { name: 'Load more' }));
	});

	// it should not render the button if `canLoadMore` is false
	it('should not render the the load more Button if `canLoadMore` is false', () => {
		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={loadedPosts}
				canLoadMore={false}
				canAdd={true}
				autoUpdate={true}
			/>
		);
		expect(screen.queryByRole('button', { name: 'Load more' })).toBeNull();
	});

	// test if PostCollection component renders correctly if the user is logged in and allowed to add posts
	it('should render the PostCreator component if `canAdd` is true with a send button', () => {
		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={loadedPosts}
				canLoadMore={true}
				canAdd={true}
				autoUpdate={true}
			/>
		);
		expect(screen.getByText('Deine Meinung zählt'));
		expect(screen.getByRole('button', { name: 'Absenden' }));
	});

	// test if PostCollection component renders correctly if the user is not logged in and not allowed to add posts
	it('should `not` render the PostCreator component if `canAdd` is false (user is not logged in)', () => {
		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={loadedPosts}
				canLoadMore={true}
				canAdd={false}
				autoUpdate={true}
			/>
		);
		expect(screen.queryByRole('button', { name: 'Absenden' })).toBeNull();
	});

	// test if PostCollection component renders correctly if the feed returns no posts
	it('should not render a message to the user if there are no Posts available', () => {
		render(
			<PostCollection
				headline="Whats new in Mumble...."
				posts={[]}
				canLoadMore={false}
				canAdd={false}
				autoUpdate={true}
			/>
		);
		expect(screen.getByText('Keine Posts vorhanden.'));
	});

	//test if PostCollection component renders correctly if a filter is applied
	it('should render the PostCollection component with a filter of userId', async () => {
		render(
			<PostCollection
				posts={loadedPosts}
				canLoadMore={true}
				canAdd={true}
				autoUpdate={true}
				filter={{ creator: '201444056083988737' }}
			/>
		);

		const tomLinks = screen.getAllByRole('link', { name: 'tomschall' });
		expect(tomLinks).toHaveLength(3);
	});
});

describe('PostList Component input rendering', () => {
	const loadedPosts = mockLoadedPosts as TPost[];

	afterAll(cleanup);
	// it should render the PostList component and display a post-hashtag as text
	it('should render PostList component with text', () => {
		render(
			<PostList
				posts={loadedPosts}
				variant="timeline"
				onAnswerPost={jest.fn()}
				noPostsMessage="Keine Posts vorhanden."
			/>
		);
		expect(screen.getAllByText('#popcorn'));
	});

	// it should render also an empty PostList
	it('should render an empty PostList component with a feedback text if no Posts are loaded', () => {
		render(<PostList posts={[]} variant="timeline" onAnswerPost={jest.fn()} noPostsMessage="Keine Posts vorhanden." />);
		expect(screen.getByText('Keine Posts vorhanden.'));
	});
});