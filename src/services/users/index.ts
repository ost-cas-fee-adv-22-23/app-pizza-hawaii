import { decodeTime } from 'ulid';
import { TUser } from '../../types';

type RawUser = Omit<TUser, 'createdAt profileLink'>;

type TUserResponse = {
	count: number;
	data: RawUser[];
};
export type TUploadImage = File & { preview: string };

const fetchUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
	const { limit, offset, accessToken } = params || {};

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users?${new URLSearchParams({
		limit: limit?.toString() || '10',
		offset: offset?.toString() || '0',
	})}`;
	console.log(url, accessToken);
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

const transformUser = (user: RawUser) => ({
	...user,
	profileLink: `/user/${user.userName}`,
	//createdAt: new Date(decodeTime(user.id)).toISOString(),
});

export const usersService = {
	fetchUsers,
	// hier kommen weitere Methoden für den Users-Service
};
