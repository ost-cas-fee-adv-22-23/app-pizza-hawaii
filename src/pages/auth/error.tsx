import Head from 'next/head';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';

export default function LogoutPage() {
	return (
		<LoginLayout title="Mumble - Error">
			<h1>Error &rarr;</h1>
		</LoginLayout>
	);
}
