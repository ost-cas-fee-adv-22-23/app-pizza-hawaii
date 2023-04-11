import { Button, Form, FormInput, FormPassword, Grid, Label } from '@smartive-education/pizza-hawaii';
import React, { FC, FormEvent, useEffect, useState } from 'react';

// import { TZitadelUser } from '../../types/Zitadel';

export type TAccountFormData = {
	password_1: string;
	password_2: string;
	userName: string;
	email: string;
};

export type TAccountFormErrors = { [key in keyof TAccountFormData]?: string };

export type TAccountForm = {
	onSubmit: (data: TAccountFormData) => { status: boolean; errors?: TAccountFormErrors };
	user: TAccountFormData;
	sectionlabel?: string;
};

const emptyState: TAccountFormData = {
	password_1: '',
	password_2: '',
	userName: '',
	email: '',
};

export const AccountForm: FC<TAccountForm> = ({ onSubmit, user, sectionlabel }) => {
	const [state, setState] = useState(user || emptyState);
	const [formIsValid, setFormIsValid] = useState(false);
	const [errors, setErrors] = useState<TAccountFormErrors>({});

	// check if form is valid
	useEffect(() => {
		// check if all fields are empty
		const isEmpty = Object.values(state).every((value) => value === '');

		// if there are no validation errors and
		// the form is not empty, set formIsValid to true
		setFormIsValid(Object.keys(errors).length === 0 && !isEmpty);
	}, [state, errors]);

	const validateFields = (fields: HTMLFormControlsCollection) => {
		// get all fields that are not valid (empty if required, mail adress malformed, etc.)
		const invalidFields = Array.from(fields).filter((field) => {
			const { validity } = field as HTMLInputElement;

			return !validity.valid;
		});

		// get validation messages for all invalid fields
		const validationMessages = invalidFields.reduce((acc, field) => {
			const { name, validationMessage } = field as HTMLInputElement;

			acc[name as keyof TAccountFormData] = validationMessage;

			return acc;
		}, {} as TAccountFormErrors);

		return validationMessages;
	};

	const onSubmitHandler = (e: FormEvent) => {
		e.preventDefault();

		// get all fields from event target
		const { target } = e;
		const fields = (target as HTMLFormElement).elements;

		// validate fields
		const validationMessages = validateFields(fields);

		// if it's not ready to submit, set errors and return
		if (!Object.keys(validationMessages).length) {
			setErrors(validationMessages);
			return;
		}

		// if it's ready to submit, call onSubmit function
		const res = onSubmit(state);

		// if the request was successful, reset state otherwise set errors
		if (res.status === true) {
			setState(emptyState);
		} else {
			setErrors(res.errors || {});
		}
	};

	const onFieldChange = (e: FormEvent): void => {
		const { name, value } = e.target as HTMLInputElement;

		// update state
		setState({
			...state,
			[name]: value,
		});

		// reset error for this field
		setErrors({
			...errors,
			[name]: undefined,
		});
	};

	return (
		<Form onSubmit={onSubmitHandler} noValidate>
			<fieldset>
				<Label as="legend" size="XL">
					{sectionlabel || 'Deine Daten'}
				</Label>
				<div className="mt-4">
					<Grid variant="col" gap="M" marginBelow="M">
						<FormInput
							name="userName"
							label="Username"
							type="text"
							onChange={onFieldChange}
							errorMessage={errors['userName']}
							required
						/>
						<FormInput
							name="email"
							label="E-Mail"
							type="email"
							onChange={onFieldChange}
							errorMessage={errors['email']}
							required
							autoComplete="email"
						/>
						<FormPassword
							name="password_1"
							label="Vorname"
							type="text"
							onChange={onFieldChange}
							errorMessage={errors['password_1']}
							required
							autoComplete="off"
						/>
						<FormPassword
							name="password_2"
							label="Name"
							type="text"
							onChange={onFieldChange}
							errorMessage={errors['password_2']}
							required
							autoComplete="off"
						/>
					</Grid>
				</div>
			</fieldset>

			<br />

			{/*
				We use the readyToSubmit state to enable/disable the submit button only visually.
				We don't want to disable the button completely, because then the user wouldn't be able to see the errors.
			*/}

			<div className={formIsValid ? 'opacity-100' : 'opacity-50'}>
				<Button size="L" type="submit" colorScheme="gradient" icon="mumble">
					Let&lsquo; Mumble
				</Button>
			</div>
		</Form>
	);
};
