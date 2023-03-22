import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta charSet="utf-8" />
				<link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
				<link rel="icon" type="image/png" href="/assets/images/favicon.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
