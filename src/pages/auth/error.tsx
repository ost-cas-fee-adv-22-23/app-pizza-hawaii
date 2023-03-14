import Head from 'next/head';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';

export default function LogoutPage() {
	return (
		<>
			<Head>
				<title>Error</title>
			</Head>

			<LoginLayout>
				<h1>Error ! &rarr;</h1>
			</LoginLayout>
		</>
	);
}
