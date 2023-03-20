import { signIn, useSession } from 'next-auth/react';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';
import { Button, Headline, Label } from '@smartive-education/pizza-hawaii';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function LoginPage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push('/');
		}
	}, [session, router]);

	return (
		<LoginLayout>
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
					<Button as="button" onClick={() => signIn('zitadel')} colorScheme="gradient" icon="mumble">
						Login via Zitadel
					</Button>
					<br />

					<Link href="/auth/register">
						<span className="text-violet-600 underline">Jetzt registrieren</span>
					</Link>
				</>
			)}
		</LoginLayout>
	);
}
