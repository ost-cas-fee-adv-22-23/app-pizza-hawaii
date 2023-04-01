export type TUser = {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	displayName: string;
	profileLink: string;
	email?: string;
	city?: string;
	bio?: string;
	avatarUrl?: string;
	posterImage?: string;
	createdAt?: string;
};

export type TUserSimple = {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	displayName: string;
	profileLink: string;
	avatarUrl?: string;
};
