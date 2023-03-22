import { LoginLayout } from '../components/layoutComponents/LoginLayout';
import Link from 'next/link';
import { Richtext, Headline } from '@smartive-education/pizza-hawaii';

// replacement for pages/404.js in a mumble layout.
const FourOhFourPage = () => {
	return (
		<LoginLayout>
			<>
				<Headline level={1} as="h1">
					<span className="text-pink-600">Upsiii...</span>
				</Headline>
				<Headline level={2} as="h3">
					<span className="text-violet-600">HTTP 404 - Page not Found</span>
					<br />
					Something went south on ClientSide..
				</Headline>
				<br />
				<Richtext size="M" as="div">
					ErrorMessage: - Page not Found
				</Richtext>
				<br />
				<Link href="/">
					<span className="text-violet-600">Back Home</span>
				</Link>
			</>
		</LoginLayout>
	);
};

export default FourOhFourPage;
