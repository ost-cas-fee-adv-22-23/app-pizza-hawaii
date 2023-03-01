import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '@smartive-education/pizza-hawaii/dist/bundle.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import LoginPage from './login';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const validUser = !pageProps?.currentuser || false
	
	return (
		<SessionProvider session={session}>
			{validUser 
				? <Component {...pageProps} />
				: <LoginPage />
			}
		</SessionProvider>
	);
}
