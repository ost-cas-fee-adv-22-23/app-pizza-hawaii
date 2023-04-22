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

export async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl;

	const session = await getToken({ req });

	// rewrite url from /mumble/:id to /mumble/public/:id if user is not logged in
	if (pathname.startsWith('/mumble/') && !session) {
		const id = pathname.split('/mumble/')[1];
		return NextResponse.rewrite(`${origin}/mumble/public/${id}`);
	}
}
