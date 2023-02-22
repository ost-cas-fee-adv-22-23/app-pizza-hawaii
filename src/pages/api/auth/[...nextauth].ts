import NextAuth from 'next-auth';
import { TokenSetParameters } from 'openid-client';
import { TUser } from '../../../types';

type TProfileUser = {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
};

type TProfile = {
	profile: TProfileUser;
	tokens: TokenSetParameters;
	lastName: string;
	userName: string;
};

export default NextAuth({
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

				const userName = profile.preferred_username.replace('@smartive.zitadel.cloud', '');

				return {
					id: profile.sub,
					firstName: profile.given_name,
					lastName: profile.family_name,
					userName: userName,
					avatarUrl: profile.picture || undefined,
					profileLink: `user/${userName}`,
					createdAt: new Date().toISOString(),
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
				token.user = user;
			}

			if (Date.now() > (token.expiresAt as number)) {
				delete token.accessToken;
			}

			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			return session;
		},
	},
});
