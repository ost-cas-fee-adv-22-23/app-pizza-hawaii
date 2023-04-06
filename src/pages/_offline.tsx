import { LoginLayout } from '../components/layoutComponents/LoginLayout';
import { Headline } from '@smartive-education/pizza-hawaii';

export default function OfflinePage() {
	return (
		<LoginLayout title="Mumble - Login">
			<Headline level={1} as="h2">
				🤪 You are offline!
				<br /> <br />
				<span className="text-pink-600">
					Check your internet Connection, Mumble is more Fun <span className="text-violet-600">Online</span>.
				</span>
				<br />
			</Headline>
		</LoginLayout>
	);
}
