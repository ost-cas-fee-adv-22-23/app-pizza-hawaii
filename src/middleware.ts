export { default } from 'next-auth/middleware';

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/public (static files are now moved to public folder)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/public|_next/image|auth|favicon.ico|mumble/public).*)',
		'/',
	],
};
