import { FC } from 'react';
import { LoginLayout } from '../components/LoginLayout';
import { Richtext, Headline } from '@smartive-education/pizza-hawaii';

interface TFourOhFourPage {
	error: React.ErrorInfo  | string| unknown | undefined | null;
}

// pages/404.js
const FourOhFourPage: FC<TFourOhFourPage> = (error) => {
	console.error(error);	
	// TODO: somehow a bit more elegant that
	const missingUser = (error.error === 'missing User') ? true : false;

	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Upsiii... </span>
				</Headline>
				{missingUser 
				? <Headline level={2} as="h3">Where is any User? 😵</Headline>
				:(
					<>
					<Headline level={2} as="h3">
						<span className="text-violet-600">HTTP 404</span>
						<br />Something went south on ClientSide..
					</Headline>
					<br />
					<Richtext size="M" as="div">
						ErrorMessage: Page not found.
					</Richtext>
					</>)}
			</>
		</LoginLayout>
	);
};

export default FourOhFourPage;
