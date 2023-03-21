import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import { ThemeContextProvider } from '../context/useTheme';

import '../styles/globals.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
	return (
		<SessionProvider session={session}>
			<ThemeContextProvider>
				<Component {...pageProps} />
			</ThemeContextProvider>
		</SessionProvider>
	);
}
