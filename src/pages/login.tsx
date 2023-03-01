import { signIn, signOut, useSession } from 'next-auth/react';
import LoginLayout from '../components/LoginLayout';
import { Button, Headline, Label } from '@smartive-education/pizza-hawaii';

export default function LoginPage() {
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
					<Headline as='h1' level={1}>Anmelden</Headline>
					<br />
					<Button as='button' onClick={() => signIn('zitadel')} colorScheme='gradient' icon='mumble' >Login to Mumble</Button>
					<br />
					<Label as='legend' size='S' className='text-slate-100'>Zitadel login needed</Label>
					<br />
					<div className='text-right'>
						<Label as='label' size='M'>noch kein Account? </Label>&nbsp;
						<a className='text-violet-600 underline' href="/register">Jetzt registrieren</a>
					</div>
				</>
			)}
		</LoginLayout>
	);
}
