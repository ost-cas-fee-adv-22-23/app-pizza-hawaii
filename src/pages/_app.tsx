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
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
				<link rel="icon" type="image/png" href="./favicon.png" />
			</Head>
			<ErrorBoundary>
				<SessionProvider session={session}>
					<ThemeContextProvider>
						<FolloweeContextProvider>
							<ActiveTabContextProvider>
								<Component {...pageProps} />
							</ActiveTabContextProvider>
						</FolloweeContextProvider>
					</ThemeContextProvider>
				</SessionProvider>
			</ErrorBoundary>
		</>
	);
}
