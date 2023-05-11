//test PostDetail renders correctly
import { cleanup, render, screen} from '@testing-library/react';

import { PostDetail } from './PostDetail';
import postMock from '@/__mocks__/post.json';

const props = {
    post: postMock,
    canWrite: false,
};


// describe('PostDetail renders correctly', () => {

// // console.log('post postMock', postMock);
//     it('should render PostDetail', () => {
//         const { container } = render(<PostDetail {...props}  />);
//         console.log('container', container);
//         expect(container.querySelector('PostDetail'));
//     })
// });