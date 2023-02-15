import 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		user: User;
	}

	interface User {
		id: string;
		firstname: string;
		lastname: string;
		username: string;
		avatarUrl?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		user?: User;
	}
}
