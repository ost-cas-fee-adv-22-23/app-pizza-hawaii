import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Issuer } from 'openid-client';

import { services } from '../../../services';
import { TUser } from '../../../types';

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
	try {
		const issuer = await Issuer.discover(process.env.ZITADEL_ISSUER ?? '');
		const client = new issuer.Client({
			id: 'zitadel',
			name: 'zitadel',
			type: 'oauth',
			version: '2',
			wellKnown: process.env.ZITADEL_ISSUER,
			authorization: {
				params: {
					scope: `openid email profile offline_access urn:zitadel:iam:org:project:id:zitadel:aud`,
				},
			},
			idToken: true,
			checks: ['pkce', 'state'],
			token_endpoint_auth_method: 'none',
			client_id: process.env.ZITADEL_CLIENT_ID as string,
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
};

const getUser = async (userId: string, accessToken: string): Promise<TUser> => {
	return (await services.users.getUser({ id: userId, accessToken })) as TUser;
};

export const authOptions = {
	providers: [
		{
			id: 'zitadel',
			name: 'zitadel',
			type: 'oauth',
			version: '2',
			wellKnown: process.env.ZITADEL_ISSUER,
			authorization: {
				params: {
					scope: `openid email profile offline_access urn:zitadel:iam:org:project:id:zitadel:aud`,
				},
			},
			idToken: true,
			checks: ['pkce', 'state'],
			client: {
				token_endpoint_auth_method: 'none',
			},
			clientId: process.env.ZITADEL_CLIENT_ID,
			async profile(profile, tokens) {
				const user = await getUser(profile?.sub, tokens.access_token as string);
				return {
					...user,
					email: profile.email,
				} as TUser;
			},
		},
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

			// if the access token has expired, try to update it
			if (token.refreshToken) {
				const newToken = await refreshAccessToken(token);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore: Object is possibly 'null'.
				if (!newToken.error) {
					return newToken;
				}
			}

			delete token.accessToken;

			return token;
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
		newUser: '/auth/signup', // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXTAUTH_SECRET,
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default NextAuth(authOptions);
