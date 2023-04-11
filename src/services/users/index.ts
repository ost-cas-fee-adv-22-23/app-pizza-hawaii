import { homeTown, memberSince, shortBio } from '../../data/helpers/dataRandomizer';
import { TRawUser, TUser, TUserSimple } from '../../types';
import { fetchItem, fetchList } from '../qwacker';

type TFetchBase = {
	accessToken: string;
};

const TTL = 5 * 60 * 1000; // 5 minutes

type TUserCache = {
	[id: string]: {
		data: TUser;
		createdAt: number;
	};
};

const userCache: TUserCache = {};

/**
 * Get all users
 *
 * @param {number} limit
 * @param {number} offset
 *
 * @returns {Promise<{ count: number; users: TUser[] }>}
 */

type TGetUsers = TFetchBase & {
	limit?: number;
	offset?: number;
};

type TGetUsersResult = {
	count: number;
	users: TUser[];
};

const getUsers = async ({ limit, offset = 0, accessToken }: TGetUsers): Promise<TGetUsersResult> => {
	const maxLimit = 1000;
	// create url params
	const urlParams = new URLSearchParams({
		offset: offset.toString(),
	});

	if (limit !== undefined) {
		urlParams.set('limit', Math.min(limit, maxLimit).toString());
	}

	const { count, items } = (await fetchList({
		endpoint: 'users',
		accessToken,
		method: 'GET',
		...urlParams,
	})) as { count: number; items: TRawUser[] };

	const users = items.map(transformUser) as TUser[];

	// If there are more entries to fetch, make a recursive call
	if (count > 0 && (!limit || limit > users.length)) {
		const remainingLimit = limit ? limit - users.length : undefined;
		const remainingOffset = limit ? offset + limit : offset + users.length;

		const { users: remainingUsers, count: remainingCount } = await getUsers({
			offset: remainingOffset,
			limit: remainingLimit,
			accessToken,
		});

		return {
			count: remainingCount,
			users: [...users, ...remainingUsers].slice(0, limit),
		};
	}
	return {
		count,
		users,
	};
};

type TGetUsersByIds = TFetchBase & {
	ids: string[];
};

async function getUsersByIds({ ids, accessToken }: TGetUsersByIds): Promise<TUser[]> {
	const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);

	const users = await Promise.all(uniqueIds.map((id) => getUser({ id, accessToken })));

	return users;
}

/**
 * Get a single user by id
 *
 * @param {string} id
 *
 * @returns {Promise<TUser>}
 */

type TGetUser = TFetchBase & {
	id: string;
};

const getUser = async ({ id, accessToken }: TGetUser) => {
	// Check if user is already in cache
	const cachedUser = userCache[id];

	if (cachedUser && Date.now() - cachedUser.createdAt <= TTL) {
		return cachedUser.data;
	}

	const user = (await fetchItem({
		endpoint: `users/${id}`,
		accessToken,
		method: 'GET',
	})) as TRawUser;

	const userData = transformUser(user);

	// Add user to cache
	userCache[id] = {
		createdAt: Date.now(),
		data: userData,
	};

	return userData;
};

// some data aggregation from dataRandomizer helper to fill the gaps what is not provided by the API
const transformUser = (user: TRawUser): TUser => ({
	posterImage: `//picsum.photos/seed/${user.id}1/1466/1060/`,
	bio: `Hello my name is ${user.firstName}. I am a ${shortBio()}`,
	createdAt: memberSince(),
	city: homeTown(),
	...user,
	profileLink: `/user/${user.id}`,
	displayName: `${user.firstName} ${user.lastName}`,
	avatarUrl:
		user.avatarUrl ||
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAAAQlBMVEV8Ou3///+9nPb38/6MUu/v5/3OtfjFqfeERu7ezvu2kPWld/Oda/GthPSca/Hm2vyVX/DWwvm9nfa+nPa+nfatg/TA3Iq2AAAEXElEQVR42uzazbKbMAwFYB38HxcDafv+r9rp3LtJBkZwwcLO6NufhYIiKyaklFJKKaWUUkoppZRSSimllFJKKaWUUuqnbPk7+DQ5g/+Mm5IfHiVS72IOyWCdSSH3W2EJEzhTKNSfEgz2cb6v+uanwRHOW+pESTguZerAmPAzbqTGjQ4APrK8knCOa3a22AXnNTpaHgZXMA9qjk24Smrt4T0MrmOaGiwx4FqhnaXTOlzNtdKaxeB6bqYWjKijhak5oJYnHdRRbfdX91Lbh1X3VttHVTfgzQdV90B9I91jhoRftFPre8kaY0ledJAxRRIXICXQHj0sXS0sYpZZlrv+2iVISsTo7oTb35gdN6V0Y3pIW0hKwT5dLioO+/Q4U0ZsMSFbojl7rOODt2/QDhuWSN+sB+Nw0JGEcde8/g0WH5R/dA7r/rBH4blgovoy1nl6s4DBBuUHZsI6S2+iAYMJyj86i3We/VF0PjhTZR7rMtvA54NPqsxh3cw+5PNBQ3UVbKAVYDBB8ZHiby0uUFUOGyx/9Xc+aKimAkgNFPm+DNgSmBY+HJTvywlbTORn3vngRPVEbFuYz/+aYKRq8oFLnAG848FMVfAL1ZPd7c8HA1WT9v5vKy5gsEHx5dmA4fNMZHMwYHBB+ZMu4n6WXvR9pccc4/1eou+8Senl/T5voFcd36LzP9w7fW8lfBZMuN9Er7p+RyB28WxwP0OVoAX0RYu7qrjhSq0V96+9O9BxFATCAPyPMAhKq929vv+rXi6bS3q5FSF1ENz5HqDkL1gUy9BnQ5lt+t7DGdpmcRxL2wyEMG1bKz19MIQstO1WaalmgZBA2yYcZ6BtAUIcbXM4ziO7nUrfKFca/gOEPOvMBZ4SJgiJlDDXWfqNEGIpYazzwO8hxVSZXbmglVrrDLHGAmKAmLHGuHRljdS51I2Xv7BphhhPKR8VVn495CzyXceUsEDQKN51A6WMEBRJuOssU0qEJCP8xTpKYYgaKSnKviRzEBUpib3otrUIWYaSRslxwRA2UNok+HLTQdhKO1a5j7aQFijNWKk9sAHiIu1gK5ONZsgL++lEsjEquNEeXiVqqtxQA9Ouqfx3somOy9toPPrCEkaNdBwQaB9H5LozNdNxQKQczh5ZeSqilgfl4I+MaJmVMB2qsYay8GSPiFZ5G/xEuRI1Ve/OUKYJNQXKxm7235UJfk12/o3XG9vgl8cw3y0AeLs+J8f0pcFBeeh/Lxua4n5GPRT4hepgj0L9VJ9gizNEqmFFsW5K9Uw4yydJ+4Vs3aUrytZZusJsXaUrztZRuvOz/Xsj1vdN13dWpuOZiDbY49MtrdRxvnYFbgA3Q0dpsPD9laveX/u8gkRZqyKPBrvtS2R6T2hlAvhpp7u8FS80H+2POVxuQL6ypQuTn20cvZArZuczYzed9iLmnD/XZbKrnxz4l4/Tf2c+PmOzk7VSSimllFJKKaWUUkoppZRSSimllFJKqTP9BiSAPrpV6Kh2AAAAAElFTkSuQmCC',
});

const reducedUserInformation = (user: TUser): TUserSimple =>
	({
		...user,
		email: undefined,
		city: undefined,
		bio: undefined,
		posterImage: undefined,
		createdAt: undefined,
	} as TUserSimple);

export const usersService = {
	getUsers,
	getUser,
	getUsersByIds,
	reducedUserInformation,
};
