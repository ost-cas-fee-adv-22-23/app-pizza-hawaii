import '../styles/globals.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import ErrorBoundary from '../components/ErrorBoundary';
import { ActiveTabContextProvider } from '../context/useActiveTab';
import { FolloweeContextProvider } from '../context/useFollowee';
import { ThemeContextProvider } from '../context/useTheme';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="theme-color" content="#7c3aed" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
				<link rel="manifest" crossOrigin="use-credentials" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/public/icon-192x192.png" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="icon" type="image/png" href="/favicon.png" />
			</Head>
			<SessionProvider session={session}>
				<ErrorBoundary>
					<ThemeContextProvider>
						<FolloweeContextProvider>
							<ActiveTabContextProvider>
								<Component {...pageProps} />
							</ActiveTabContextProvider>
						</FolloweeContextProvider>
					</ThemeContextProvider>
				</ErrorBoundary>
			</SessionProvider>
		</>
	);
}
