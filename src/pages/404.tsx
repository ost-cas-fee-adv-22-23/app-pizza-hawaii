import { FC } from 'react';
import { LoginLayout } from '../components/layoutComponents/LoginLayout';
import { Richtext, Headline } from '@smartive-education/pizza-hawaii';

interface TFourOhFourPage {
	error: React.ErrorInfo | string | unknown | undefined | null;
	reason: string;
}

// pages/404.js
const FourOhFourPage: FC<TFourOhFourPage> = (error) => {
	const missingUser = error.reason === 'missing User' ? true : false;
	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Upsiii...</span>
				</Headline>
				{missingUser ? (
					<Headline level={2} as="h3">
						No User found... 😵
					</Headline>
				) : (
					<>
						<Headline level={2} as="h3">
							<span className="text-violet-600">HTTP 404</span>
							<br />
							Something went south on ClientSide..
						</Headline>
						<br />
						<Richtext size="M" as="div">
							ErrorMessage: Page not found.
						</Richtext>
					</>
				)}
			</>
		</LoginLayout>
	);
};

export default FourOhFourPage;
