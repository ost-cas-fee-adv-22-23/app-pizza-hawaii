import { FC } from 'react';
import { Headline, Richtext } from '@smartive-education/pizza-hawaii';
import { LoginLayout } from '../components/LoginLayout';

interface TCustom500Page {
	errorInfo?: React.ErrorInfo | null;
}

// pages/500.js
const Custom500Page: FC<TCustom500Page> = (errorInfo) => {
	const { message, stack } = errorInfo;

	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Ouch! </span>
				</Headline>
				<Headline level={2} as="h3">
					<span className="text-violet-600">500</span>
					<br />
					Server Side error occured. Something went south..
				</Headline>
				<br />
				<Richtext size="M">
					Errorcode here {message} - Stack {stack}
				</Richtext>
			</>
		</LoginLayout>
	);
};

export default Custom500Page;
