import { Button, Richtext } from '@smartive-education/pizza-hawaii';
import { useRouter } from 'next/router';
import React from 'react';

import { LoginLayout } from '../components/layout/LoginLayout';

export default function OfflinePage() {
	const router = useRouter();
	return (
		<LoginLayout title="Mumble - Login">
			<Richtext size="L">
				🤪 You are offline! Check your connection, Mumble is more Fun
				<span className="text-violet-600">Online</span>.
			</Richtext>
			<br />
			<Button colorScheme="violet" onClick={() => router.back()}>
				Start Mumble again
			</Button>
		</LoginLayout>
	);
}
