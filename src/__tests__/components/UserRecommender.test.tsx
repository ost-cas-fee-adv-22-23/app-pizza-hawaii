import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import { UserRecommender } from '../../components/widgets/UserRecommender';

/**
 * Unit tests for the UserRecommender component
 *
 * These tests are written to make sure that the UserRecommender component is rendered correctly.
 * Unfortunately we cannot render the UserCardList with the UserCard component, because the UserCard component uses the useSession hook.
 * and another hook in the FollowButton component. But we can test the UserRecommender component with the UserCardList component.
 *
 * We test the following on UserRecommender
 * 1. Render UserRecommender component with the correct title
 * 2. Render UserRecommender component with the correct title classes
 * 3. Render UserRecommender component with the correct number of UserCard Skeletons
 * 4. Render UserRecommender component with the correct number of UserCard Skeletons when limit is 4
 * 5. Match snapshot
 *
 **/

const props = {
	currentUserId: '1234567890',
	excludeUserIds: ['10000004', '10000005', '10000006'],
	limit: 6,
};

jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
}));

describe('UserRecommender component', () => {
	afterEach(cleanup);
	test('renders the title Header with the correct words and correct classes', async () => {
		const mockSession = {
			user: { name: 'Filiks Adamski', email: 'filiks.adamski@mumble.com', id: '1234567890' },
			expires: '1',
		};
		(useSession as jest.Mock).mockReturnValue([mockSession, false]);

		const { container } = render(<UserRecommender {...props} />);
		expect(container.querySelector('h2')).toHaveTextContent('Empfohlene User');
		expect(container.querySelector('h2')).toHaveClass('leading-tight text-3xl font-bold');
	});

	// Expecting 6 Skeletons to be rendered when the component is loading
	test('renders 6 UserCard components with skeletons', async () => {
		const { container } = render(<UserRecommender {...props} />);
		expect(container.getElementsByClassName('animate-pulse')).toHaveLength(6);
	});

	// if the limit is 4, only 4 skeletons should be rendered
	test('renders 4 UserCard components with skeletons when given limit is 4', async () => {
		// updating props for test: propsLimit4
		const propsLimit4 = {
			currentUserId: '1234567890',
			excludeUserIds: ['10000004', '10000005', '10000006'],
			limit: 4,
		};
		const { container } = render(<UserRecommender {...propsLimit4} />);
		expect(container.getElementsByClassName('animate-pulse')).toHaveLength(4);
	});

	test('renders to match snapshot', async () => {
		const { container } = render(<UserRecommender {...props} />);
		expect(container).toMatchSnapshot();
	});
});
