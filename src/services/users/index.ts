import { TUser } from '../../types';

type TRawUser = Omit<TUser, 'createdAt profileLink, displayName, posterImage, bio, city'>;

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

type TgetUserByPostId = {
	id: string;
	accessToken: string;
};

const getUserByPostId = async ({ id, accessToken }: TgetUserByPostId) => {
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
	posterImage: '//picsum.photos/seed/1466/1060/',
	bio: `Hello my name is ${user.firstName}. I am a big fan of the Qwacker community and I am looking forward to meet you all.`,
	createdAt: new Date().toISOString(), // TODO: Find correct solution. This is not the correct date of creation but the last update of the user profile.
	city: 'Switzerland',
	...user,
	profileLink: `/user/${user.id}`,
	displayName: `${user.firstName} ${user.lastName}`,
	avatarUrl:
		user.avatarUrl ||
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAAAQlBMVEV8Ou3///+9nPb38/6MUu/v5/3OtfjFqfeERu7ezvu2kPWld/Oda/GthPSca/Hm2vyVX/DWwvm9nfa+nPa+nfatg/TA3Iq2AAAEXElEQVR42uzazbKbMAwFYB38HxcDafv+r9rp3LtJBkZwwcLO6NufhYIiKyaklFJKKaWUUkoppZRSSimllFJKKaWUUuqnbPk7+DQ5g/+Mm5IfHiVS72IOyWCdSSH3W2EJEzhTKNSfEgz2cb6v+uanwRHOW+pESTguZerAmPAzbqTGjQ4APrK8knCOa3a22AXnNTpaHgZXMA9qjk24Smrt4T0MrmOaGiwx4FqhnaXTOlzNtdKaxeB6bqYWjKijhak5oJYnHdRRbfdX91Lbh1X3VttHVTfgzQdV90B9I91jhoRftFPre8kaY0ledJAxRRIXICXQHj0sXS0sYpZZlrv+2iVISsTo7oTb35gdN6V0Y3pIW0hKwT5dLioO+/Q4U0ZsMSFbojl7rOODt2/QDhuWSN+sB+Nw0JGEcde8/g0WH5R/dA7r/rBH4blgovoy1nl6s4DBBuUHZsI6S2+iAYMJyj86i3We/VF0PjhTZR7rMtvA54NPqsxh3cw+5PNBQ3UVbKAVYDBB8ZHiby0uUFUOGyx/9Xc+aKimAkgNFPm+DNgSmBY+HJTvywlbTORn3vngRPVEbFuYz/+aYKRq8oFLnAG848FMVfAL1ZPd7c8HA1WT9v5vKy5gsEHx5dmA4fNMZHMwYHBB+ZMu4n6WXvR9pccc4/1eou+8Senl/T5voFcd36LzP9w7fW8lfBZMuN9Er7p+RyB28WxwP0OVoAX0RYu7qrjhSq0V96+9O9BxFATCAPyPMAhKq929vv+rXi6bS3q5FSF1ENz5HqDkL1gUy9BnQ5lt+t7DGdpmcRxL2wyEMG1bKz19MIQstO1WaalmgZBA2yYcZ6BtAUIcbXM4ziO7nUrfKFca/gOEPOvMBZ4SJgiJlDDXWfqNEGIpYazzwO8hxVSZXbmglVrrDLHGAmKAmLHGuHRljdS51I2Xv7BphhhPKR8VVn495CzyXceUsEDQKN51A6WMEBRJuOssU0qEJCP8xTpKYYgaKSnKviRzEBUpib3otrUIWYaSRslxwRA2UNok+HLTQdhKO1a5j7aQFijNWKk9sAHiIu1gK5ONZsgL++lEsjEquNEeXiVqqtxQA9Ouqfx3somOy9toPPrCEkaNdBwQaB9H5LozNdNxQKQczh5ZeSqilgfl4I+MaJmVMB2qsYay8GSPiFZ5G/xEuRI1Ve/OUKYJNQXKxm7235UJfk12/o3XG9vgl8cw3y0AeLs+J8f0pcFBeeh/Lxua4n5GPRT4hepgj0L9VJ9gizNEqmFFsW5K9Uw4yydJ+4Vs3aUrytZZusJsXaUrztZRuvOz/Xsj1vdN13dWpuOZiDbY49MtrdRxvnYFbgA3Q0dpsPD9laveX/u8gkRZqyKPBrvtS2R6T2hlAvhpp7u8FS80H+2POVxuQL6ypQuTn20cvZArZuczYzed9iLmnD/XZbKrnxz4l4/Tf2c+PmOzk7VSSimllFJKKaWUUkoppZRSSimllFJKqTP9BiSAPrpV6Kh2AAAAAElFTkSuQmCC',
});

export const usersService = {
	getUsers,
	getUserById,
	getUserByPostId,
};
