import { decodeTime } from 'ulid';

export type Mumble = {
	id: string;
	creator: string | User;
	text: string;
	mediaUrl: string;
	mediaType: string;
	likeCount: number;
	likedByUser: boolean;
	type: string;
	replyCount: number;
	createdAt: string;
};
export type User = {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	email?: string;
	city?: string;
	bio?: string;
	avatarUrl?: string;
	posterImage?: string;
	createdAt?: string;
};

type RawMumble = Omit<Mumble, 'createdAt'>;
type RawUser = Omit<User, 'createdAt'>;

type QwackerMumbleResponse = {
	count: number;
	data: RawMumble[];
};
type QwackerUserResponse = {
	count: number;
	data: RawUser[];
};

export type UploadImage = File & { preview: string };

export const fetchMumbles = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
	const { limit, offset, newerThanMumbleId } = params || {};

	const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts?${new URLSearchParams({
		limit: limit?.toString() || '10',
		offset: offset?.toString() || '0',
		newerThan: newerThanMumbleId || '',
	})}`;

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
		},
	});
	const { count, data } = (await res.json()) as QwackerMumbleResponse;

	const mumbles = data.map(transformMumble);

	return {
		count,
		mumbles,
	};
};

export const fetchUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
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
	const { count, data } = (await res.json()) as QwackerUserResponse;

	const users = data;//.map(transformUser);

	return {
		count,
		users,
	};
};

export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
	if (!accessToken) {
		throw new Error('No access token');
	}

	const formData = new FormData();
	formData.append('text', text);
	if (file) {
		formData.append('image', file);
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (!response.ok) {
			throw new Error('Something was not okay');
		}

		return transformMumble(await response.json());
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
	}
};
const transformMumble = (mumble: RawMumble) => ({
	...mumble,
	createdAt: new Date(decodeTime(mumble.id)).toISOString(),
});

const transformUser = (user: RawUser) => ({
	...user,
	createdAt: new Date(decodeTime(user.id)).toISOString(),
});
