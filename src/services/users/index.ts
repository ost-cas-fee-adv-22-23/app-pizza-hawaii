import { homeTown, memberSince, shortBio } from '../../data/helpers/dataRandomizer';
import { TRawUser, TUser, TUserSimple } from '../../types';
import { ItemCache } from '../../utils/ItemCache';
import { fetchItem, fetchList, TFetchListResultPagination } from '../qwacker';

const userCache = new ItemCache<TUser>(5 * 60 * 1000); // 5 minutes

type TFetchBase = {
	accessToken: string;
};

/**
 *
 *	============== Get list of users ==============
 *
 */

type TGetUsers = TFetchBase & {
	limit?: number;
	offset?: number;
};

type TGetUsersResult = {
	count: number;
	users: TUser[];
	pagination?: TFetchListResultPagination;
};

/**
 * Get all users
 *
 * @param {string} accessToken
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{ count: number; users: TUser[] }>}
 */

const getUsers = async (params: TGetUsers): Promise<TGetUsersResult> => {
	const { accessToken, ...searchParams } = params;

	const { count, items, pagination } = (await fetchList({
		endpoint: 'users',
		accessToken,
		method: 'GET',
		...searchParams,
	})) as { count: number; items: TRawUser[]; pagination?: TFetchListResultPagination };

	// normalize users
	const users = items.map(transformUser) as TUser[];

	// Add users to cache
	users.forEach((userData) => {
		userCache.add(userData);
	});

	return {
		count,
		users,
		pagination,
	};
};

/**
 *
 *	============== Get users by ids ==============
 *
 */

type TGetUsersByIds = TFetchBase & {
	ids: string[];
};

/**
 * Get users by ids
 * @param {string} accessToken
 * @param {string[]} ids
 * @returns {Promise<TUser[]>}
 */

async function getUsersByIds({ ids, accessToken }: TGetUsersByIds): Promise<TUser[]> {
	const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);

	const users = await Promise.all(uniqueIds.map((id) => getUser({ id, accessToken })));

	return users;
}

/**
 *
 * ============== Get a single user by id ==============
 *
 */

type TGetUser = TFetchBase & {
	id: string;
};

/**
 * Get a single user by id
 *
 * @param {string} accessToken
 * @param {string} id
 * @returns {Promise<TUser>}
 */

const getUser = async ({ id, accessToken }: TGetUser) => {
	// Check if user is already in cache
	const cachedUser = userCache.get(id);

	if (cachedUser) {
		return cachedUser;
	}

	const user = (await fetchItem({
		endpoint: `users/${id}`,
		accessToken,
		method: 'GET',
	})) as TRawUser;

	const userData = transformUser(user);

	// Add user to cache
	userCache.add(userData);

	return userData;
};

/**
 *
 * ============== HELPERS ==============
 *
 */

// some data aggregation from dataRandomizer helper to fill the gaps what is not provided by the API
const transformUser = (user: TRawUser): TUser => ({
	posterImage: `https://picsum.photos/seed/${user.id}1/1466/1060/`,
	bio: `Hello my name is ${user.firstName}. I am a ${shortBio(user.id)}`,
	createdAt: memberSince(user.id),
	city: homeTown(user.id),
	displayName: `${user.firstName} ${user.lastName}`,
	...user,
	profileLink: `/user/${user.id}`,
	avatarUrl:
		user.avatarUrl ||
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAAAQlBMVEV8Ou3///+9nPb38/6MUu/v5/3OtfjFqfeERu7ezvu2kPWld/Oda/GthPSca/Hm2vyVX/DWwvm9nfa+nPa+nfatg/TA3Iq2AAAEXElEQVR42uzazbKbMAwFYB38HxcDafv+r9rp3LtJBkZwwcLO6NufhYIiKyaklFJKKaWUUkoppZRSSimllFJKKaWUUuqnbPk7+DQ5g/+Mm5IfHiVS72IOyWCdSSH3W2EJEzhTKNSfEgz2cb6v+uanwRHOW+pESTguZerAmPAzbqTGjQ4APrK8knCOa3a22AXnNTpaHgZXMA9qjk24Smrt4T0MrmOaGiwx4FqhnaXTOlzNtdKaxeB6bqYWjKijhak5oJYnHdRRbfdX91Lbh1X3VttHVTfgzQdV90B9I91jhoRftFPre8kaY0ledJAxRRIXICXQHj0sXS0sYpZZlrv+2iVISsTo7oTb35gdN6V0Y3pIW0hKwT5dLioO+/Q4U0ZsMSFbojl7rOODt2/QDhuWSN+sB+Nw0JGEcde8/g0WH5R/dA7r/rBH4blgovoy1nl6s4DBBuUHZsI6S2+iAYMJyj86i3We/VF0PjhTZR7rMtvA54NPqsxh3cw+5PNBQ3UVbKAVYDBB8ZHiby0uUFUOGyx/9Xc+aKimAkgNFPm+DNgSmBY+HJTvywlbTORn3vngRPVEbFuYz/+aYKRq8oFLnAG848FMVfAL1ZPd7c8HA1WT9v5vKy5gsEHx5dmA4fNMZHMwYHBB+ZMu4n6WXvR9pccc4/1eou+8Senl/T5voFcd36LzP9w7fW8lfBZMuN9Er7p+RyB28WxwP0OVoAX0RYu7qrjhSq0V96+9O9BxFATCAPyPMAhKq929vv+rXi6bS3q5FSF1ENz5HqDkL1gUy9BnQ5lt+t7DGdpmcRxL2wyEMG1bKz19MIQstO1WaalmgZBA2yYcZ6BtAUIcbXM4ziO7nUrfKFca/gOEPOvMBZ4SJgiJlDDXWfqNEGIpYazzwO8hxVSZXbmglVrrDLHGAmKAmLHGuHRljdS51I2Xv7BphhhPKR8VVn495CzyXceUsEDQKN51A6WMEBRJuOssU0qEJCP8xTpKYYgaKSnKviRzEBUpib3otrUIWYaSRslxwRA2UNok+HLTQdhKO1a5j7aQFijNWKk9sAHiIu1gK5ONZsgL++lEsjEquNEeXiVqqtxQA9Ouqfx3somOy9toPPrCEkaNdBwQaB9H5LozNdNxQKQczh5ZeSqilgfl4I+MaJmVMB2qsYay8GSPiFZ5G/xEuRI1Ve/OUKYJNQXKxm7235UJfk12/o3XG9vgl8cw3y0AeLs+J8f0pcFBeeh/Lxua4n5GPRT4hepgj0L9VJ9gizNEqmFFsW5K9Uw4yydJ+4Vs3aUrytZZusJsXaUrztZRuvOz/Xsj1vdN13dWpuOZiDbY49MtrdRxvnYFbgA3Q0dpsPD9laveX/u8gkRZqyKPBrvtS2R6T2hlAvhpp7u8FS80H+2POVxuQL6ypQuTn20cvZArZuczYzed9iLmnD/XZbKrnxz4l4/Tf2c+PmOzk7VSSimllFJKKaWUUkoppZRSSimllFJKqTP9BiSAPrpV6Kh2AAAAAElFTkSuQmCC',
});

// to get reduced user information for client api calls
const reducedUserInformation = (user: TUser): TUserSimple =>
	({
		...user,
		email: undefined,
		city: undefined,
		bio: undefined,
		posterImage: undefined,
		createdAt: undefined,
	} as TUserSimple);

const emptyUser = (id?: string): TUser => {
	// parse from string id a number and use it to get a random user name
	const userName = id ? `user${parseInt(id, 10) % 1000}` : '';

	return {
		id: '',
		userName: userName,
		firstName: '',
		lastName: '',
		displayName: id ? `A Mumble User` : '',
		profileLink: id ? `/user/${id}` : '',
		avatarUrl: '',
		posterImage: '',
		createdAt: '',
	};
};

export const usersService = {
	getUsers,
	getUser,
	getUsersByIds,
	reducedUserInformation,
	emptyUser,
};
