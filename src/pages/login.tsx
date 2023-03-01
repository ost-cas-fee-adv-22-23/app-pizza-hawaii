import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import LoginLayout from '../components/LoginLayout';
import { Button } from '@smartive-education/pizza-hawaii';

export default function Home() {
	const { data: session } = useSession();

	return (
		<LoginLayout>
			{!!session && (
				<a href="#" onClick={() => signOut()}>
					<span>bye-bye: display logout screen</span>
					<h2>Logout &rarr;</h2>
					<p>Logout from your account</p>
				</a>
			)}

			{!session && (
				<>
					<a href="#" onClick={() => signIn('zitadel')}>
						<span>schön kommt noch: login or register screen</span>
						<br />
						<br />
						<h2>Login &rarr;</h2>
						<p>Login with a ZITADEL account</p>
					</a>
					<br />
					<div>
						<span>noch kein Account?</span>
						<a className='text-violet-600 underline' href="/register">Jetzt registrieren</a>
					</div>
				</>
			)}
		</LoginLayout>
	);
}
