import { TUser } from '../../types';

type TRawUser = Omit<TUser, 'createdAt profileLink'>;

/**
 * Get all users
 *
 * @param {number} limit
 * @param {number} offset
 * @param {string} accessToken
 *
 * @returns {Promise<{ count: number; users: TUser[] }>}
 */

type TGetUser = {
	limit?: number;
	offset?: number;
	accessToken: string;
};

type TGetUserResult = {
	count: number;
	users: TUser[];
};

const getUsers = async ({ limit, offset = 0, accessToken }: TGetUser): Promise<TGetUserResult> => {
	const maxLimit = 1000;

	// create url params
	const urlParams = new URLSearchParams({
		offset: offset.toString(),
	});

	if (limit !== undefined) {
		urlParams.set('limit', Math.min(limit, maxLimit).toString());
	}

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users?${urlParams}`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const { count, data } = (await res.json()) as { count: number; data: TRawUser[] };
	const users = data.map(transformUser) as TUser[];

	// load more users if limit is not set and the amount of users is less than the total count
	if (limit === undefined && users.length < count) {
		const remainingOffset = offset + users.length;
		const { users: remainingUsers } = await getUsers({
			offset: remainingOffset,
			accessToken,
		});

		return {
			count,
			users: [...users, ...remainingUsers],
		};
	}

	return {
		count,
		users,
	};
};

/**
 * Get a single user by id
 *
 * @param {string} id
 * @param {string} accessToken
 *
 * @returns {Promise<TUser>}
 *
 * @throws {Error} if no valid id was provided
 * @throws {Error} if the response was not ok
 *
 */
type TGetUserById = {
	id: string;
	accessToken: string;
};

const getUserById = async ({ id, accessToken }: TGetUserById) => {
	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users/${id}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const user = (await res.json()) as TRawUser;
	return transformUser(user);
};

/**
 * Get a single user by id
 *
 * @param {string} id
 * @param {string} accessToken
 *
 * @returns {Promise<TUser>}
 *
 * @throws {Error} if no valid id was provided
 * @throws {Error} if the response was not ok
 * @throws {Error} if the response was unauthorized
 */

type TGetUserByPostId = {
	id: string;
	accessToken: string;
};

const getUserbyPostId = async ({ id, accessToken }: TGetUserByPostId) => {
	if (!id) {
		throw new Error('getUserByPostId: No valid UserId was provided');
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}users/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (res.status === 401) {
			throw new Error('getUserByPostId: unauthorized');
		}

		if (res.status !== 200) {
			throw new Error('getUserByPostId: Something went wrong with the response!');
		}

		const user = (await res.json()) as TRawUser;
		return transformUser(user);
	} catch (error) {
		throw new Error('getUserByPostId: could not reach API');
	}
};

const transformUser = (user: TRawUser): TUser => ({
	...user,
	profileLink: `/user/${user.userName}`,
	//createdAt: new Date(decodeTime(user.id)).toISOString(),
});

export const usersService = {
	getUsers,
	getUserById,
	getUserbyPostId,
};
