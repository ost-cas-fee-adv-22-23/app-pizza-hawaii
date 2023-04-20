import { Grid, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import router from 'next/router';
import React from 'react';

import { AccountForm, TAccountFormData } from '../../components/form/AccountForm';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';

const RegisterPage = () => {
	const onSubmit = (data: TAccountFormData) => {
		let errors = {};

		// TODO: Implement the real registration
		console.error('Function not implemented. But we will throw sometimes some errors anyway. ;)', data);

		// Simulate some errors to show the error messages and annoy the users
		Math.random() > 0.5 && (errors = { ...errors, userName: 'Username already taken' });
		Math.random() > 0.5 && (errors = { ...errors, firstName: 'First name is required' });
		Math.random() > 0.5 && (errors = { ...errors, lastName: 'Last name is required' });

		// If there are errors, return them
		if (Object.keys(errors).length > 0) {
			return { status: false, errors: errors };
		}

		// If there are no errors, go to the next step
		router.push('/');

		// Return true to indicate that the form was submitted successfully for a few milliseconds
		return { status: true };
	};

	return (
		<LoginLayout title="Mumble - Registrierung">
			<Grid variant="col" gap="L" centered={false}>
				<Headline level={2}>Register now</Headline>

				<AccountForm onSubmit={onSubmit} />

				<div className="mt-3 text-center">
					<Label as="span" size="M">
						Bereits registriert? &nbsp;
						<Link href="/login" component={NextLink}>
							Jetzt anmelden
						</Link>
					</Label>
				</div>
			</Grid>
		</LoginLayout>
	);
};

export default RegisterPage;
