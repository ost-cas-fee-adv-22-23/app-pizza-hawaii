import { get } from '../../services/api/posts/get';
// import { like, unlike } from '../../services/api/posts/like';
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
import mockPost from '../../__mocks__/post.json';

// TODO: discuss if we want to mock the fetch call or not at all.

describe('get Service', () => {
	it.skip('should fetch a post with a given Id', async () => {
		const response = await get({ id: '01GZFZES838XW8SV8QVWCJSN6C' });
		console.log('response', response);
		// expect(response).toEqual(mockPost);
		expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/endpoint`, {
			headers: {
				Authorization: 'Bearer test token',
				'content-type': 'application/json',
			},
			method: 'GET',
		});
		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(response).toEqual(mockPost);
	});
});
