import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import { PostCollection } from '../../../../src/components/post/PostCollection';
import { PostList } from '../../../../src/components/post/PostList';
import { TPost } from '../../../../src/types/Post';
import mockLoadedPosts from '../../../../tests/unit/mocks/loadedPosts.json';

/**
 * Unit tests for the PostCollection and PostList components.
 *
 * These components are re-used a lot in our Application and represent the core-functionality of our app.
 * So it is important to test them thoroughly.
 *
 * We test the following on PostCollection
 * 1. Renders Headline
 * 2. User can load more and add
 * 3. User can not load more or add
 * 4. Render an empty PostList component with a feedback text if no Posts are loaded
 * 5. Show all posts
 * 6. Filter posts by creator
 *
 **/

jest.mock('next-auth/react');

describe('PostCollection Component input rendering', () => {
	const loadedPosts = mockLoadedPosts as TPost[];

	// fake a logged in user
	(useSession as jest.Mock).mockReturnValue([{}, true]);

	it('Renders headline', () => {
		// generate random string for the headline
		const headline = Math.random().toString(36).substring(7);

		render(<PostCollection posts={[]} canLoadMore={false} headline={headline} />);

		expect(screen.getByText(headline));
	});

	it('User can load more and add', () => {
		render(<PostCollection posts={loadedPosts} canLoadMore={true} canAdd={true} />);

		expect(screen.getByTestId('post-creator'));
		expect(screen.getByTestId('load-more-btn'));
	});

	it('User can not load more or add', () => {
		render(<PostCollection posts={[]} canLoadMore={false} canAdd={false} />);

		expect(screen.queryByTestId('post-creator')).toBeNull();
		expect(screen.queryByTestId('load-more-btn')).toBeNull();
	});

	it('Render an empty PostList component with a feedback text if no Posts are loaded', () => {
		render(<PostCollection posts={[]} canLoadMore={false} canAdd={false} />);
		const el = screen.getByTestId('no-posts-available-message');
		expect(el);
		expect(el.textContent).not.toBeNull();
	});

	it('Show all posts', async () => {
		render(<PostCollection posts={loadedPosts} canLoadMore={false} />);
		const postItems = screen.getAllByTestId('post-item');
		expect(postItems).toHaveLength(13);
	});

	it('Filter posts by creator', async () => {
		render(<PostCollection posts={loadedPosts} canLoadMore={false} filter={{ creator: '201444056083988737' }} />);

		const tomLinks = screen.getAllByRole('link', { name: 'tomschall' });
		expect(tomLinks).toHaveLength(3);
	});
});
