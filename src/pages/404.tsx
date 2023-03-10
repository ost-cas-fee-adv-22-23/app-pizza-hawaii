import { FC } from 'react';
import { LoginLayout } from '../components/LoginLayout';
import { Richtext, Headline } from '@smartive-education/pizza-hawaii';

// pages/404.js
const FourOhFourPage: FC = () => {
	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Upsiii... </span>
				</Headline>
				<Headline level={2} as="h3">
					<span className="text-violet-600">404</span>
					<br />
					Page not found. Something went south..
				</Headline>
				<br />
				<Richtext size="M">[Errorcode here]</Richtext>
			</>
		</LoginLayout>
	);
};

export default FourOhFourPage;
