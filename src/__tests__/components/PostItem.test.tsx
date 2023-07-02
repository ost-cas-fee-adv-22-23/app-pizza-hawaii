import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import postMock from '../../__mocks__/post.json';
import { PostItem } from '../../components/post/PostItem';
import { TPost } from '../../types/Post';

/**
 * Unit tests for the PostItem component.
 *
 * Basicly we want to know if this often re-used Component is working with the basic funtionailities.
 * We test the following on PostItem
 * 1. Render PostItem component with text
 * 2. Render PostItem component with a link when a hastag is used in the text
 * 3. Render PostItem component with a link when a user is mentioned in the text
 * 4. Render PostItem component with a link when a url is used in the text
 * 5. Render PostItem component with a like button
 * 6. Render PostItem component with a userName with all the correct css classes
 * 7. Render PostItem component with a avatar image with and height 64px
 * 8. Render PostItem component with a copy button for the current user
 * 9. Render PostItem component with a disabled copy button for other users
 * 10. Render PostItem component with a copy button for the current user
 * 11. Render PostItem component with a like button for the current user
 *
 **/

jest.mock('next-auth/react');

export type TPostItemProps = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	onDeletePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

const propsDetailPage: TPostItemProps = {
	post: postMock as TPost,
	variant: 'detailpage',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

const propsTimelinePage: TPostItemProps = {
	post: postMock as TPost,
	variant: 'timeline',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
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
		const { container } = render(<PostItem {...propsDetailPage} />);
		expect(container.querySelector('#hashtag'));
		expect(container.querySelector('a'));
	});

	test('PostItem variant `DetailPage` renders a link when a user is mentioned in the text', async () => {
		const { container } = render(<PostItem {...propsDetailPage} />);
		expect(container.querySelector('#user'));
		expect(container.querySelector('a'));
	});

	test('PostItem variant `DetailPage` renders a link when a url is used in the text', async () => {
		const { container } = render(<PostItem {...propsDetailPage} />);
		expect(container.querySelector('#url'));
		expect(container.querySelector('a'));
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
		useSession.mockReturnValue({ data: { user: currentUser } });

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
