import NextAuth, { NextAuthOptions } from 'next-auth';

import { services } from '../../../services';
import { TUser } from '../../../types';

export const authOptions: NextAuthOptions = {
	providers: [
		{
			id: 'zitadel',
			name: 'zitadel',
			type: 'oauth',
			version: '2',
			wellKnown: process.env.ZITADEL_ISSUER,
			authorization: {
				params: {
					scope: 'openid email profile',
				},
			},
			idToken: true,
			checks: ['pkce', 'state'],
			client: {
				token_endpoint_auth_method: 'none',
			},
			async profile(_, { access_token }): Promise<TUser> {
				if (!access_token) throw new Error('No access token found');

				const { userinfo_endpoint } = await (
					await fetch(`${process.env.ZITADEL_ISSUER}/.well-known/openid-configuration`)
				).json();

				const profile = await (
					await fetch(userinfo_endpoint, {
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					})
				).json();

				const user = (await services.users.getUserById({ id: profile.sub, accessToken: access_token })) as TUser;
				return {
					...user,
					email: profile.email,
				};
			},
			clientId: process.env.ZITADEL_CLIENT_ID,
		},
	],
	session: {
		maxAge: 12 * 60 * 60, // 12 hours
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.expiresAt = (account.expires_at as number) * 1000;
			}
			if (user) {
				token.user = user as TUser;
			}

			if (Date.now() > (token.expiresAt as number)) {
				delete token.accessToken;
			}

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
		newUser: '/auth/register', // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
