import { Grid, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import router from 'next/router';
import React from 'react';

import { AccountForm, TAccountFormData } from '../../components/form/AccountForm';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';
import { zitadelService } from '../../services/api/zitadel';

const RegisterPage = () => {
	const onSubmit = (data: TAccountFormData) => {
		let errors = {};

		(async () => {
			await zitadelService.registerUserProfile({
				userName: data.userName,
				profile: {
					firstName: data.firstName,
					lastName: data.lastName,
				},
				email: {
					email: data.email,
				},
			});

			// TODO: Implement the registration process
			// Implementation was not successful we get a invalid JSOn from the Zitadel API

			console.error('Function not implemented. But we will throw sometimes some errors anyway. ;)', data);

			// Simulate some errors to show the error messages and annoy the users
			Math.random() > 0.33 && (errors = { ...errors, userName: 'Username already taken' });
			Math.random() > 0.33 && (errors = { ...errors, userName: 'E-Mail already registered' });

			// If there are errors, return them
			if (Object.keys(errors).length > 0) {
				return { status: false, errors: errors };
			}

			// If there are no errors, go to the next step
			router.push('/');
		})();

		// Return true to indicate that the form was submitted successfully for a few milliseconds
		return { status: true };
	};

	return (
		<LoginLayout title="Mumble - Registrierung">
			<Grid variant="col" gap="L" centered={false}>
				<Headline level={2}>Registrieren</Headline>

				<AccountForm onSubmit={onSubmit} />

				<div className="mt-3 text-center">
					<Label as="span" size="M">
						Bereits registriert? &nbsp;
						<Link href="/auth/login" component={NextLink}>
							Jetzt anmelden
						</Link>
					</Label>
				</div>
			</Grid>
		</LoginLayout>
	);
};

export default RegisterPage;
