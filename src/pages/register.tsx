import { FormInput } from '@smartive-education/pizza-hawaii';
import Head from 'next/head';
import Link from 'next/link';

const RegisterPage = () => {

	return (
		<>
			<Head>
				<title>Register to Mumble</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
                <h1>Register now</h1>
 
               {/* TODO: Form here\ */}
               <br/ >
                <Link href='/'>Back to startpage</Link>
			</main>
		</>
	);
}

export default RegisterPage