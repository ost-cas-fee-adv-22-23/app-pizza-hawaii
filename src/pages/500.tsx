import { FC } from 'react';
import NextLink from 'next/link';

import { Headline, Richtext, Link } from '@smartive-education/pizza-hawaii';
import { LoginLayout } from '../components/layoutComponents/LoginLayout';

type TCustom500Page = {
	errorInfo: React.ErrorInfo | unknown | undefined | null;
};

// pages/500.js
const Custom500Page: FC<TCustom500Page> = (error) => {
	console.log('custom500', error);
	const { errorInfo } = error;
	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Ouch! </span>
				</Headline>
				<Headline level={2} as="h3">
					<span className="text-violet-600">HTTP 500</span>
					<br />
					Something went south... A Server Side error occured.
				</Headline>
				<br />
				<Richtext size="M" as="div">
					<>ErrorMessage: {errorInfo}</>
				</Richtext>
				<br />
				<Link href="/" component={NextLink}>
					Back Home
				</Link>
			</>
		</LoginLayout>
	);
};

export default Custom500Page;
