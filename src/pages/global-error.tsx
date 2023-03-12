'use client';

//global-error.js replaces the root layout.js when active and so must define its own <html> and <body> tags
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
	const { message, stack } = error;

	return (
		<html>
			<head>Mumble Global Error Page</head>
			<body>
				<h2>Something went wrong!</h2>
				<p>Error Message: {message}</p>
				<p>Error Stack: {stack}</p>
				<br />
				<button onClick={() => reset()}>Try again</button>
			</body>
		</html>
	);
}
