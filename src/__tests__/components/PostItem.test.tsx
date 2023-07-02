import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import postMock from '../../__mocks__/post.json';
import { PostItem, TPostItemProps } from '../../components/post/PostItem';
import { TPost } from '../../types/Post';

/**
 * Unit tests for the PostItem component.
 *
 * Basically we want to know if this often re-used Component is working with the basic functionalities.
 *
 * We test the following on PostItem
 * 1. Text gets rendered correctly
 * 2. Links get rendered correctly (hashtags, urls creation)
 * 3. User name gets rendered correctly
 * 4. Avatar image gets rendered correctly
 * 5. Copy to clipboard button gets rendered correctly
 * 6. Like button gets rendered correctly
 *
 **/

jest.mock('next-auth/react');

const propsDetailPage: TPostItemProps = {
	post: postMock as TPost,
	variant: 'detailpage',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

const propsTimelinePage: TPostItemProps = {
	...propsDetailPage,
	variant: 'timeline',
};

describe('PostItem renders correctly', () => {
	afterEach(cleanup);
	test('PostItem variant `DetailPage` renders the text of Post', async () => {
		const mockSession = {
			user: { name: 'Filiks Adamski', email: 'filiks.adamski@mumble.com' },
			expires: '1234567890',
		};
		(useSession as jest.Mock).mockReturnValue([mockSession, true]);

		render(<PostItem {...propsDetailPage} />);
		expect(screen.getByText('Hier ist noch ein'));
	});

	test('PostItem variant `DetailPage` renders a link when a hastag is used in the text', async () => {
		render(<PostItem {...propsDetailPage} />);

		const hashtagLink = screen.getByRole('link', { name: '#hashtag' });
		expect(hashtagLink.getAttribute('href')).toBe('/tag/hashtag');
	});

	test('PostItem variant `DetailPage` renders a link when a user is mentioned in the text', async () => {
		render(<PostItem {...propsDetailPage} />);

		const userLink = screen.getByRole('link', { name: 'peter' });
		expect(userLink.getAttribute('href')).toBe('/user/195305735549092097');
	});
});

/**
 * Test PostItem renders correctly for variant `Timeline` so that the text of Post is rendered correctly
 * with the correct css classes, image size and the correct user name
 */

describe('PostItem renders correctly', () => {
	afterEach(cleanup);

	// test if the text of Post is rendered with the correct css classes
	test('PostItem variant `timeline` displays the User Name with all the correct css classes', async () => {
		render(<PostItem {...propsTimelinePage} />);
		const user = screen.getByText('Peter Manser');
		expect(user).toHaveProperty(
			'className',
			'inline-block font-semibold overflow-hidden text-ellipsis mb-[-0.2em] pb-[0.2em] text-lg'
		);
	});

	// test if the variant `timeline` renders the avatar image with the correct size
	test('PostItem variant `timeline` renders Avatar image with and height 64px', async () => {
		render(<PostItem {...propsTimelinePage} />);
		const avatarImage = screen.getByRole('img');
		expect(avatarImage.getAttribute('width')).toBe('64');
		expect(avatarImage.getAttribute('height')).toBe('64');
	});

	// test if the variant `timeline` renders the text of Post with the correct css classes
	test('displays copy button for the current user', () => {
		const currentUser = {
			id: '1234567890',
			name: 'John Doe',
		};
		(useSession as jest.Mock).mockReturnValue({ data: { user: currentUser } });

		render(<PostItem variant="detailpage" post={postMock as TPost} />);
		const copyButton = screen.getAllByText('Copy Link');
		expect(copyButton).toHaveLength(1);
		expect(copyButton[0]).toBeInstanceOf(HTMLSpanElement);
	});

	// test if the like button is rendered correctly
	test('PostItem renders the like button correctly', async () => {
		render(<PostItem variant="detailpage" post={postMock as TPost} />);
		const likeButton = screen.getAllByText('Like');
		expect(likeButton).toHaveLength(1);
		expect(likeButton[0]).toBeInstanceOf(HTMLSpanElement);
	});
});
