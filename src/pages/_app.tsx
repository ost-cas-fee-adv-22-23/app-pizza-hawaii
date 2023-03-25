import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import ErrorBoundary from '../components/ErrorBoundary';

import '../styles/globals.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
				<link rel="icon" type="image/png" href="/assets/images/favicon.png" />
			</Head>
			<SessionProvider session={session}>
				<ErrorBoundary>
					<Component {...pageProps} />
				</ErrorBoundary>
			</SessionProvider>
		</>
	);
}
