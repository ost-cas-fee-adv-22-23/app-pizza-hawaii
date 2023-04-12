import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import ZitadelProvider from 'next-auth/providers/zitadel';
import { Issuer } from 'openid-client';

import { services } from '../../../services';
import { TUser } from '../../../types';

async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const issuer = await Issuer.discover(process.env.ZITADEL_ISSUER || '');
		const client = new issuer.Client({
			client_id: process.env.ZITADEL_CLIENT_ID || '',
			token_endpoint_auth_method: 'none',
		});

		const { refresh_token, access_token, expires_at } = await client.refresh(token.refreshToken as string);

		return {
			...token,
			accessToken: access_token,
			expiresAt: (expires_at ?? 0) * 1000,
			refreshToken: refresh_token, // Fall back to old refresh token
		};
	} catch (error) {
		console.error('Error during refreshAccessToken', error);

		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

async function getUser(userId: string, accessToken: string): Promise<TUser> {
	const user = (await services.users.getUser({ id: userId, accessToken })) as TUser;
	return user;
}

export const authOptions: NextAuthOptions = {
	providers: [
		ZitadelProvider({
			issuer: process.env.ZITADEL_ISSUER as string,
			clientId: process.env.ZITADEL_CLIENT_ID as string,
			clientSecret: process.env.ZITADEL_CLIENT_SECRET as string,
			authorization: {
				params: {
					scope: `openid email profile offline_access`,
				},
			},
			client: {
				token_endpoint_auth_method: 'none',
			},
			async profile(profile, tokens) {
				const user = await getUser(profile?.sub, tokens.access_token as string);
				return {
					...user,
					email: profile.email,
				} as TUser;
			},
		}),
	],
	session: {
		maxAge: 12 * 60 * 60, // 12 hours
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.expiresAt = (account.expires_at as number) * 1000;
				token.error = undefined;
			}
			if (user) {
				token.user = user as TUser;
			}
			// Return previous token if the access token has not expired yet
			if (Date.now() < (token.expiresAt as number)) {
				return token;
			}

			const newToken = await refreshAccessToken(token);

			if (newToken.error) {
				throw new Error(newToken.error as string);
			}

			return newToken;
		},
		async session({ session, token }) {
			session.user = token.user as TUser;
			session.accessToken = token.accessToken;
			return session;
		},
	},
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/logout',
		error: '/auth/error', // Error code passed in query string as ?error=
		newUser: '/auth/register', // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
