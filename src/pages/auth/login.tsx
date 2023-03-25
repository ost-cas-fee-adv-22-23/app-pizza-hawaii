import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { LoginLayout } from '../../components/layoutComponents/LoginLayout';
import { Button, Headline, Label, Link } from '@smartive-education/pizza-hawaii';

export default function LoginPage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push('/');
		}
	}, [session, router]);

	return (
		<LoginLayout title="Mumble - Login">
			{!!session && (
				<Headline level={1} as="h2">
					👌 Login successful.
					<br /> <br />
					<span className="text-pink-600">
						Welcome back, <span className="text-violet-600">{session?.user?.firstName}</span>.
					</span>
					<br />
					<Label as="p" size="M">
						Redirecting...
					</Label>
				</Headline>
			)}

			{!session && (
				<>
					<Headline as="h1" level={1}>
						Anmelden
					</Headline>
					<br />
					<Button onClick={() => signIn('zitadel')} colorScheme="gradient" icon="mumble">
						Login via Zitadel
					</Button>
					<br />

					<Link href="/auth/register" component={NextLink}>
						Jetzt registrieren
					</Link>
				</>
			)}
		</LoginLayout>
	);
}
