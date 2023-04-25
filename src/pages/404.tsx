import { Headline, Label, Link, Richtext } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import React from 'react';

import { LoginLayout } from '../components/layout/LoginLayout';

// replacement for pages/404.js in a mumble layout.
const FourOhFourPage = () => {
	return (
		<LoginLayout title="Mumble - 404">
			<Headline level={1} as="p">
				<span className="text-pink-600">Oops!</span>
			</Headline>
			<Headline level={2} as="h1">
				<span className="text-violet-600">HTTP 404 - Page not Found</span>
			</Headline>
			<br />
			<Label as="p" size="XL">
				Something went south ...
			</Label>
			<br />
			<Richtext size="M" as="div">
				<p>
					We are sorry, but the page you are looking for does not exist.
					<br />
					If you think this is a bug, please contact the administrator of this site.
				</p>
			</Richtext>
			<br />
			<Link href="/" component={NextLink}>
				Back Home
			</Link>
		</LoginLayout>
	);
};

export default FourOhFourPage;
