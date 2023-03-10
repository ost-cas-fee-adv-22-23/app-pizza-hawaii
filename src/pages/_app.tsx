import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Custom500Page from './500';

import '../styles/globals.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import LoginPage from './login';
import { useState } from 'react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

	const validUser = !pageProps?.currentuser;
	return (
		<>
			{/* <ErrorBoundary fallback={<Custom500Page onError={setErrorInfo} />}> */}
			<SessionProvider session={session}>{validUser ? <Component {...pageProps} /> : <LoginPage />}</SessionProvider>
			{/* </ErrorBoundary> */}
		</>
	);
}
