/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-head-element */
'use client';

// global-error.js replaces the root layout.js when
// active and so must define its own <html> and <body> tags
export default function GlobalError({ error }: { error?: Error }) {
	return (
		<html>
			<head>
				<title>Mumble Global Error Page</title>
			</head>
			<body>
				<h1>Something went wrong! Please come back later.</h1>
				<p>Try to screenshot this page and send it to your friendly printer-fixer admin</p>
				<br />
				<p>Error Message: {error?.message}</p>
				<br />
				<p>Error Stack: {error?.stack}</p>
				<br />
				<br /> ¯\_(ツ)_/¯
				<br />
				<a href="/login">Go back home to Login</a>
			</body>
		</html>
	);
}
