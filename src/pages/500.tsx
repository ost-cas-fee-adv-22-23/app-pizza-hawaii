import { Headline, Link, Richtext } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import { FC } from 'react';

import { LoginLayout } from '../components/layoutComponents/LoginLayout';

type TCustom500Page = {
	errorInfo: React.ErrorInfo | unknown | undefined | null;
};

// pages/500.js
const Custom500Page: FC<TCustom500Page> = (error) => {
	const { errorInfo } = error;
	return (
		<LoginLayout title="Mumble - 500">
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
