import React from 'react';
import NextLink from 'next/link';

import { Grid, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';
import { UserForm, TUserFormData } from '../../components/form/UserForm';
import router from 'next/router';

const emptyUser: TUserFormData = {
	userName: '',
	firstName: '',
	lastName: '',
};
const RegisterPage = () => {

	const onSubmit = (data: TUserFormData) => {
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
		<LoginLayout
			title="Mumble - Registrierung"
			description="Erstellen Sie ein Konto und beginnen Sie, Ihre Gedanken mit der Welt zu teilen. Registrieren Sie sich noch heute bei Mumble"
		>
			<Grid variant="col" gap="L" centered={false}>
				<Headline level={2}>Register now</Headline>

				<UserForm onSubmit={onSubmit} user={emptyUser} />

				<div className="mt-3 text-center">
					<Label as="span" size="M">
						Bereits registriert? &nbsp;
						<Link href="/login" component={NextLink}>
							Jetzt anmelden
						</Link>
					</Label>
				</div>

				<div className="mt-3 text-center">
					<Link href="/" component={NextLink}>
						Zurück
					</Link>
				</div>
			</Grid>
		</LoginLayout>
	);
};

export default RegisterPage;
