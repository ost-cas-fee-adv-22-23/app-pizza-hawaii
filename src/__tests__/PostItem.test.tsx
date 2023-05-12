//test PostDetail renders correctly
import '@/__mocks__/routerMock';
import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import { PostItem } from '../components/post/PostItem';
import postMock from '@/__mocks__/post.json';
import { TPost } from '@/types';

jest.mock('next-auth/react');

export type TPostItemProps = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	onDeletePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

const propsDetailPage: TPostItemProps = {
	post: postMock as unknown as TPost,
	variant: 'detailpage',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

const propsTimelinePage: TPostItemProps = {
	post: postMock as unknown as TPost,
	variant: 'timeline',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

/**
 * Test PostItem renders correctly for variant `DetailPage` so that the text of Post is rendered correctly
 * when users uses links, hashtags or mentions other users in the text
 */

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

	test('PostItem variant `timeline` renders correctly', async () => {
		const { container } = render(<PostItem {...propsTimelinePage} />);
		expect(container).toMatchSnapshot();
	});

	test('PostItem variant `timeline` displays the User Name with all the correct css classes', async () => {
		render(<PostItem {...propsTimelinePage} />);
		const user = screen.getByText('Peter Manser');
		expect(user).toHaveProperty(
			'className',
			'inline-block font-semibold overflow-hidden text-ellipsis mb-[-0.2em] pb-[0.2em] text-lg'
		);
	});

	test('PostItem variant `timeline` renders Avatar image with and height 64px', async () => {
		render(<PostItem {...propsTimelinePage} />);
		const avatarImage = screen.getByRole('img');
		expect(avatarImage.getAttribute('width')).toBe('64');
		expect(avatarImage.getAttribute('height')).toBe('64');
	});
});
