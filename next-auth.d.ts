import 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		user: SessionUser;
	}

	interface SessionUser {
		id: string;
		firstName: string;
		lastName: string;
		userName: string;
		avatarUrl?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		user?: SessionUser;
	}
}
