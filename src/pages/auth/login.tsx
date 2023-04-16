import { Button, Grid, Headline, Link } from '@smartive-education/pizza-hawaii';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

import VerticalLogo from '../../assets/svg/verticalLogo.svg';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';

export default function LoginPage() {
	const { data: session } = useSession();
	const router = useRouter();

	const user = session?.user;

	// get callback Url from query params
	const callbackUrl = (router.query.callbackUrl as string) || '/';

	const header = (
		<div className="w-8/12 text-pink-300 text-center">
			<div className="inline-block mb-8">
				<Image src={VerticalLogo} alt="welcome to Mumble" />
			</div>
			<Headline level={1}>
				Find out what’s new in <span className="text-white">#Frontend Engineering</span>.
			</Headline>
		</div>
	);

	return (
		<LoginLayout title="Mumble - Login" header={header}>
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
					<Button onClick={() => signOut()} colorScheme="slate" icon="logout">
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
								callbackUrl: callbackUrl,
							})
						}
						colorScheme="gradient"
						icon="mumble"
					>
						Login via Zitadel
					</Button>
					<Link href="/auth/signup" component={NextLink}>
						Jetzt registrieren
					</Link>
				</Grid>
			)}
		</LoginLayout>
	);
}
