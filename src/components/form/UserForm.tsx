import { Button, Form, FormInput, Grid, Label } from '@smartive-education/pizza-hawaii';
import React, { FC, FormEvent, useEffect, useState } from 'react';

import { TZitadelProfile } from '../../types/Zitadel';

export type TUserFormData = TZitadelProfile;

export type TUserFormErrors = { [key in keyof TUserFormData]?: string };

export type TUserForm = {
	onSubmit: (data: TUserFormData) => { status: boolean; errors?: TUserFormErrors };
	user?: TUserFormData;
	sectionlabel?: string;
};

const emptyState: TUserFormData = {
	firstName: '',
	lastName: '',
	displayName: '',
};

export const UserForm: FC<TUserForm> = ({ onSubmit, user = emptyState, sectionlabel }) => {
	const [state, setState] = useState(user);
	const [formIsValid, setFormIsValid] = useState(false);
	const [errors, setErrors] = useState<TUserFormErrors>({});

	useEffect(() => {
		setState(user);
	}, [user]);

	// check if form is valid
	useEffect(() => {
		console.log('state', state);
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

			acc[name as keyof TUserFormData] = validationMessage;

			return acc;
		}, {} as TUserFormErrors);

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
		if (Object.keys(validationMessages).length) {
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
							name="displayName"
							label="Display Name"
							type="text"
							value={state['displayName']}
							onChange={onFieldChange}
							errorMessage={errors['displayName']}
							required
						/>
						<FormInput
							name="firstName"
							label="Vorname"
							type="text"
							value={state['firstName']}
							onChange={onFieldChange}
							errorMessage={errors['firstName']}
							required
							autoComplete="given-name"
						/>
						<FormInput
							name="lastName"
							label="Name"
							type="text"
							value={state['lastName']}
							onChange={onFieldChange}
							errorMessage={errors['lastName']}
							required
							autoComplete="family-name"
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
