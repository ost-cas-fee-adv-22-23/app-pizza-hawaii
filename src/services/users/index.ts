import { TUser } from '../../types';

type RawUser = Omit<TUser, 'createdAt profileLink'>;
import { decodeTime } from 'ulid';

type TUserResponse = {
	count: number;
	data: RawUser[];
};
export type TUploadImage = File & { preview: string };

const getUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
	const { limit, offset, accessToken } = params || {};

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users?${new URLSearchParams({
		limit: limit?.toString() || '10',
		offset: offset?.toString() || '0',
	})}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const { count, data } = (await res.json()) as TUserResponse;

	const users = data.map(transformUser);

	return {
		count,
		users,
	};
};

// get User by a given User id
const getUserById = async (params?: { id: string; accessToken: string }) => {
	const { id, accessToken } = params || {};

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users/${id}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const user = (await res.json()) as RawUser;
	return transformUser(user);
};

// get User of a given Post Id
const getUserbyPostId = async (id: string, accessToken?: string) => {
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

		const user = (await res.json()) as RawUser;
		return transformUser(user);
	} catch (error) {
		throw new Error('getUserByPostId: could not reach API');
	}
};

const transformUser = (user: RawUser) => {
	return {
		...user,
		createdAt: new Date().toISOString(),
		backgroundImage: '//picsum.photos/seed/1466/1060/',
		profileLink: `/user/${user.userName}`,
		bio: 'This plugin works best if you disable all other ESLint rules relating to code formatting, and only enable rules that detect potential bugs.',
	};
};

export const usersService = {
	getUsers,
	getUserById,
	getUserbyPostId,
	// hier kommen weitere Methoden für den Users-Service
};
