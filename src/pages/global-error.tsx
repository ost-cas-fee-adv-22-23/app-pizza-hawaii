/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-head-element */
'use client';

// global-error.js replaces the root layout.js when
// active and so must define its own <html> and <body> tags
export default function GlobalError({ error }: { error?: Error }) {
	return (
		<html>
			<head>Mumble Global Error Page</head>
			<body>
				<h2>Something went really wrong!</h2>
				<p>Try to screenshot this page and send it to your friendly printer-fixer admin</p>
				<br />
				<p>Error Message: {error?.message}</p>
				<p>Error Stack: {error?.stack}</p>
				<br /> ¯\_(ツ)_/¯
				<br />
				<a href="/">Go back home</a>
			</body>
		</html>
	);
}
