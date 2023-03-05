import { FormInput } from '@smartive-education/pizza-hawaii';
import Head from 'next/head';
import Link from 'next/link';
import LoginLayout from '../components/layoutComponents/LoginLayout';

const RegisterPage = () => {

	return (
		<LoginLayout>
			<>
				<Head>
					<title>Register to Mumble</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			</>
			<main>
				<h1>Register now</h1>
				<br />
				<Link href="/">Back to startpage</Link>
			</main>
		</LoginLayout>
	);
}

export default RegisterPage