import React, { FormEvent, useState } from 'react';
import { Button, Form, FormInput, Headline, Label } from '@smartive-education/pizza-hawaii';
import Head from 'next/head';
import Link from 'next/link';
import LoginLayout from '../../components/layoutComponents/LoginLayout';

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
		<LoginLayout>
			<>
				<Head>
					<title>Register to Mumble</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			</>
			<main>
				<Headline level={2}>Register now</Headline>
				<br />
				<Form>
					<FormInput
						name="fullName"
						label="Vorname und Name"
						type="text"
						onChange={(e) => inputChangeHandler(e)}
					/>
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
					<Button
						as="button"
						size="L"
						type="submit"
						colorScheme="gradient"
						icon="mumble"
						onClick={(e) => onSubmitHandler(e)}
					>
						Let&lsquo; Mumble
					</Button>
				</Form>
				<div className="mt-3 text-center">
					<Label as="span" size="M">
						Bereits registriert? &nbsp;
						<Link href="/login">Jetzt anmelden</Link>
					</Label>
				</div>
				<br />
				<Link href="/">Back to Startpage</Link>
			</main>
		</LoginLayout>
	);
};

export default RegisterPage;
