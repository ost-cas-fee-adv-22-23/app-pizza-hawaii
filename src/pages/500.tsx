import { FC } from 'react';
import { Headline, Richtext } from '@smartive-education/pizza-hawaii';
import { LoginLayout } from '../components/layoutComponents/LoginLayout';

interface TCustom500Page {
	errorInfo: React.ErrorInfo | unknown | undefined | null;
}

// pages/500.js
const Custom500Page: FC<TCustom500Page> = (error) => {
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
			</>
		</LoginLayout>
	);
};

export default Custom500Page;
