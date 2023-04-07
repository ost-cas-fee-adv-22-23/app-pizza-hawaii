import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { LoginLayout } from '../../components/layoutComponents/LoginLayout';
import { Button, Grid, Headline, Link } from '@smartive-education/pizza-hawaii';

export default function LoginPage() {
	const { data: session } = useSession();
	const router = useRouter();

	// get callback Url from query params
	const redirectUrl = (router.query.callbackUrl as string) || '/';

	const user = session?.user;

	return (
		<LoginLayout title="Mumble - Login">
			{!!session && (
				<Grid variant="col" gap="L" centered={false}>
					<Headline level={1} as="h2">
						Hallo {user?.firstName}
					</Headline>
					<span className="text-pink-600">Du bist bereits angemeldet.</span>
					<Link href={user?.profileLink as string} component={NextLink}>
						Weiter zum Profil
					</Link>
					<br />
					<Button onClick={signOut} colorScheme="slate" icon="logout">
						Abmelden
					</Button>
				</Grid>
			)}

			{!session && (
				<Grid variant="col" gap="L" centered={true}>
					<Headline as="h1" level={1}>
						Anmelden
					</Headline>
					<Button
						onClick={() =>
							signIn('zitadel', {
								callbackUrl: redirectUrl || '/',
							})
						}
						colorScheme="gradient"
						icon="mumble"
					>
						Login via Zitadel
					</Button>
					<Link href="/auth/register" component={NextLink}>
						Jetzt registrieren
					</Link>
				</Grid>
			)}
		</LoginLayout>
	);
}
