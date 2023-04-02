import React, { FormEvent, useState } from 'react';
import NextLink from 'next/link';

import { Button, Form, FormInput, Headline, Label, Link } from '@smartive-education/pizza-hawaii';
import { LoginLayout } from '../../components/layoutComponents/LoginLayout';

const RegisterPage = () => {
	interface RegisterFormData {
		fullName: string;
		userName: string;
		email: string;
		password: string;
	}

	const formData: RegisterFormData = {
		fullName: '',
		userName: '',
		email: '',
		password: '',
	};

	const [responseBody, setResponseBody] = useState<RegisterFormData>(formData);

	const inputChangeHandler = (e: FormEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		setResponseBody({ ...responseBody, [name]: value });
	};

	const onSubmitHandler = (e: FormEvent) => {
		e.preventDefault();
		console.log('onSubmitHandler newUser:', responseBody);
		// TODO: send data to zitadel backend and redirect to login page
	};

	return (
		<LoginLayout
			title="Mumble - Registrierung"
			description="Erstellen Sie ein Konto und beginnen Sie, Ihre Gedanken mit der Welt zu teilen. Registrieren Sie sich noch heute bei Mumble"
		>
			<Headline level={2}>Register now</Headline>
			<br />
			<Form>
				<FormInput name="fullName" label="Vorname und Name" type="text" onChange={(e) => inputChangeHandler(e)} />
				<FormInput name="userName" label="Username" type="text" onChange={(e) => inputChangeHandler(e)} />
				<FormInput name="email" label="E-mail" type="email" onChange={(e) => inputChangeHandler(e)} />
				<FormInput
					name="password"
					label="Password"
					type="password"
					icon="eye"
					onChange={(e) => inputChangeHandler(e)}
				/>
				<br />
				<Button size="L" type="submit" colorScheme="gradient" icon="mumble" onClick={onSubmitHandler}>
					Let&lsquo; Mumble
				</Button>
			</Form>
			<div className="mt-3 text-center">
				<Label as="span" size="M">
					Bereits registriert? &nbsp;
					<Link href="/login" component={NextLink}>
						Jetzt anmelden
					</Link>
				</Label>
			</div>
			<br />
			<Link href="/" component={NextLink}>
				Back to Startpage
			</Link>
		</LoginLayout>
	);
};

export default RegisterPage;
