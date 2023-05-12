//test PostDetail renders correctly
import '@/__mocks__/routerMock';
import { cleanup, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import { PostItem } from '../components/post/PostItem';
import postMock from '@/__mocks__/post.json';
import { TPost, TUser } from '@/types';

jest.mock('next-auth/react');

export type TPostItemProps = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	onDeletePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

type TPostItemVariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
	showAnswerButton: boolean;
	showDeleteButton: boolean;
	showShareButton: boolean;
	showCommentButton: boolean;
	showLikeButton: boolean;
};

const postItemVariantMap: Record<TPostItemProps['variant'], TPostItemVariantMap> = {
	detailpage: {
		headlineSize: 'XL',
		textSize: 'L',
		avatarSize: 'M',
		avatarVariant: 'standalone',
		showAnswerButton: true,
		showDeleteButton: true,
		showShareButton: true,
		showCommentButton: false,
		showLikeButton: true,
	},
	timeline: {
		headlineSize: 'L',
		textSize: 'M',
		avatarSize: 'M',
		avatarVariant: 'standalone',
		showAnswerButton: false,
		showDeleteButton: true,
		showShareButton: true,
		showCommentButton: true,
		showLikeButton: true,
	},
	response: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
		showAnswerButton: true,
		showDeleteButton: true,
		showShareButton: false,
		showCommentButton: false,
		showLikeButton: true,
	},
};

const propsDetailPage: TPostItemProps = {
	post: postMock as unknown as TPost,
	variant: 'detailpage',
	onDeletePost: jest.fn(),
	onAnswerPost: jest.fn(),
};

/**
 * Test PostItem renders correctly for variant `DetailPage` so that the text of Post is rendered correctly
 * when users uses links, hashtags or mentions other users in the text
 */

describe('PostItem renders correctly', () => {
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
