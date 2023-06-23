import 'next-auth/jwt';

import { TUser } from './src/types';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		user: TUser;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		user?: TUser;
	}
}
