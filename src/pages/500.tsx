import { Headline, Label, Link, Richtext } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import React, { FC } from 'react';

import { LoginLayout } from '../components/layoutComponents/LoginLayout';

type TCustom500Page = {
	errorInfo?: React.ErrorInfo | unknown | null;
};

// pages/500.js
const Custom500Page: FC<TCustom500Page> = (error) => {
	const { errorInfo } = error;
	return (
		<LoginLayout title="Mumble - 500">
			<>
				<Headline level={1} as="p">
					<span className="text-pink-600">Oops!</span>
				</Headline>
				<Headline level={2} as="h1">
					<span className="text-violet-600">HTTP 500 - Internal Server Error</span>
				</Headline>
				<br />
				<Label as="p" size="XL">
					Something went south ...
				</Label>
				<Richtext size="M" as="div">
					<p>Please refresh the page or try again later.</p>
				</Richtext>
				{errorInfo && (
					<Richtext as="div" size="M">
						ErrorMessage: {errorInfo.toString()}
					</Richtext>
				)}
				<br />
				<Link href="/" component={NextLink}>
					Back Home
				</Link>
			</>
		</LoginLayout>
	);
};

export default Custom500Page;
