//test PostDetail renders correctly
import '@/__mocks__/routerMock';
import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import { PostItem } from '../components/post/PostItem';
import postMock from '@/__mocks__/post.json';

jest.mock('next-auth/react');

const propsDetailPage = {
	post: postMock,
	variant: 'detailpage',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

describe('PostItem renders correctly', () => {
	it('PostItem renders the text of Post', async () => {
		const mockSession = {
			user: { name: 'Filiks Adamski', email: 'filiks.adamski@mumble.com' },
			expires: '1234567890',
		};
		(useSession as jest.Mock).mockReturnValue([mockSession, true]);

		render(<PostItem {...propsDetailPage} />);
		// console.log('container', container);
		expect(screen.getByText('Hier ist noch ein'));
	});
});
