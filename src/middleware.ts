import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
		'/((?!api|_next/public|_next/image|auth|favicon.ico).*)',
		'/',
	],
};
export async function middleware(req: NextRequest): Promise<NextResponse> {
	const { pathname, origin } = req.nextUrl;

	try {
		const session = await getToken({ req });
		if (!session) {
			if (pathname.includes('/mumble/') && !pathname.includes('/mumble/public/')) {
				const id = pathname.split('/mumble/')[1];
				return NextResponse.rewrite(`${origin}/mumble/public/${id}`);
			}

			const listAllowed = ['api/', '_next/', 'auth/', 'favicon.ico', 'mumble/'];

			// if not in listAllowed, redirect to login
			if (!listAllowed.some((item) => pathname.includes(item))) {
				return NextResponse.redirect(`${origin}/auth/login`);
			}
		}

		return NextResponse.next();
	} catch (error) {
		console.error(`Error in middleware: ${error}`);
		return NextResponse.next();
	}
}
