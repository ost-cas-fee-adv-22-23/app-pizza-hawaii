import { cleanup, render, screen } from '@testing-library/react';
import { PostCollection } from '../../components/post/PostCollection';
import { useSession } from 'next-auth/react';
import '@/__mocks__/routerMock';
import  mockLoadedPosts from '@/__mocks__/loadedPosts.json';
import { TPost } from '../../types/Post'
import { PostList } from '@/components/post/PostList';

jest.mock('next-auth/react');
describe('PostCollection Component input rendering', () => {

    const loadedPosts: TPost[] = mockLoadedPosts
        
    // const postCollectionProps: any = {
    //     posts: mockLoadedPosts as TPost[],
    //     canAdd: false,
    //     canLoadMore: true,
    //     autoUpdate: true,
    //     filter: {creator: "201444056083988737"},
    // };

    afterAll(cleanup);
    // test if PostCollection component renders correctly
    it('should render the PostCollection component with text', () => {
        const mockSession = {
			user: { name: 'Filiks Adamski', email: 'filiks.adamski@mumble.com' },
			expires: '1234567890',
		};
		(useSession as jest.Mock).mockReturnValue([mockSession, true]);

        render(<PostCollection 
            headline="Whats new in Mumble...."
            posts={loadedPosts}
            canLoadMore={true}
            canAdd={true}
            autoUpdate={true}
         />);
        expect(screen.getByText('Deine Meinung zählt'));
    });

    // test if PostCollection component renders correctly
    it('should render the the load more Button if `canLoadMore` is true', () => {
        render(<PostCollection
            headline="Whats new in Mumble...."
            posts={loadedPosts}
            canLoadMore={true}
            canAdd={true}
            autoUpdate={true}
         />);
        expect(screen.getByRole('button', { name: 'Load more'}) );
    });

    // it should not render the button if `canLoadMore` is false
    it('should not render the the load more Button if `canLoadMore` is false', () => {
        render(<PostCollection
            headline="Whats new in Mumble...."
            posts={loadedPosts}
            canLoadMore={false}
            canAdd={true}
            autoUpdate={true}
         />);
        expect(screen.queryByRole('button', { name: 'Load more'}) ).toBeNull();
    });
    
    // test if PostCollection component renders correctly if the user is logged in and allowed to add posts
    it('should render the PostCreator component if `canAdd` is true with a send button', () => {
        render(<PostCollection
            headline="Whats new in Mumble...."
            posts={loadedPosts}
            canLoadMore={true}
            canAdd={true}
            autoUpdate={true}
            />);
        expect(screen.getByText('Deine Meinung zählt'));
        expect(screen.getByRole('button', { name: 'Absenden' }) );
    });

    // test if PostCollection component renders correctly if the user is not logged in and not allowed to add posts
    it('should `not` render the PostCreator component if `canAdd` is false (user is not logged in)', () => {
        render(<PostCollection
            headline="Whats new in Mumble...."
            posts={loadedPosts}
            canLoadMore={true}
            canAdd={false}
            autoUpdate={true}
            />);
        expect(screen.queryByRole('button', { name: 'Absenden' }) ).toBeNull();
    });

    // test if PostCollection component renders correctly if the feed returns no posts
    it('should not render a message to the user if there are no Posts available', () => {
        render(<PostCollection
            headline="Whats new in Mumble...."
            posts={[]}
            canLoadMore={false}
            canAdd={false}
            autoUpdate={true}
            />);
        expect(screen.getByText('Keine Posts vorhanden.'));
        });
});

describe('PostList Component input rendering', () => {
    const loadedPosts: TPost[] = mockLoadedPosts

    afterAll(cleanup);

    it('should render PostList component with text', () => {
        render(<PostList 
            posts={loadedPosts}
            variant='timeline'
            onAnswerPost={jest.fn()}
            noPostsMessage='No Posts'
            />);
        expect(screen.getAllByText('#popcorn'));
    });

    it('should should match snapshot', () => {
        const { container } = render(<PostList 
            posts={loadedPosts}
            variant='timeline'
            onAnswerPost={jest.fn()}
            noPostsMessage='No Posts'
            />);
        expect(container).toMatchSnapshot();
    });
});
