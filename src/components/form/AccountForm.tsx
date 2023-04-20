import { Button, Form, FormInput, FormPassword, Grid, Label } from '@smartive-education/pizza-hawaii';
import React, { FC, FormEvent, useEffect, useState } from 'react';

export type TAccountFormData = {
	password_1: string;
	password_2: string;
	userName: string;
	email: string;
};

type TAccountFormDataKeys = keyof TAccountFormData;

export type TAccountFormErrors = { [key in keyof TAccountFormData]?: string };

export type TAccountForm = {
	onSubmit: (data: TAccountFormData) => { status: boolean; errors?: TAccountFormErrors };
	onCancel?: () => void;
	user?: TAccountFormData;
	sectionLabel?: string;
	isLoading?: boolean;
};

const emptyState: TAccountFormData = {
	password_1: '',
	password_2: '',
	userName: '',
	email: '',
};

export const AccountForm: FC<TAccountForm> = ({ onCancel, onSubmit, user = emptyState, sectionLabel, isLoading }) => {
	const [state, setState] = useState(user);
	const [isUntouched, setIsUntouched] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<TAccountFormErrors>({});

	useEffect(() => {
		setState(user);
	}, [user]);

	useEffect(() => {
		// check if form is untouched
		const isUntouched = Object.entries(state).every(([key, value]) => value === user[key as TAccountFormDataKeys]);
		setIsUntouched(isUntouched);
	}, [state, user]);

	useEffect(() => {
		// check if all fields are empty
		const isEmpty = Object.values(state).every((value) => value === '');

		// if there are no validation errors and
		// the form is not empty, set isValid to true
		setIsValid(Object.keys(errors).length === 0 && !isEmpty);
	}, [state, errors]);

	useEffect(() => {
		// check if passwords match
		if (state.password_1 !== state.password_2) {
			setErrors((prev) => ({ ...prev, password_2: 'Die Passwörter stimmen nicht überein.' }));
		} else {
			setErrors((prev) => ({ ...prev, password_2: undefined }));
		}
	}, [state]);

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

		setIsSubmitting(true);

		// get all fields from event target
		const fields = (e.target as HTMLFormElement).elements;

		// validate fields
		const validationMessages = validateFields(fields);

		// if it's not ready to submit, set errors and return
		if (Object.keys(validationMessages).length) {
			setErrors(validationMessages);
			setIsSubmitting(false);
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
		setIsSubmitting(false);
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
					{sectionLabel || 'Deine Daten'}
				</Label>
				<div className={['mt-4', isLoading && 'opacity-50 animate-pulse'].join(' ')}>
					<Grid variant="col" gap="M" marginBelow="M">
						<FormInput
							name="userName"
							label="Username"
							type="text"
							value={state['userName']}
							onChange={onFieldChange}
							errorMessage={errors['userName']}
							required
							icon="mumble"
							autoComplete="off"
						/>
						<FormInput
							name="email"
							label="Email"
							type="email"
							value={state['email']}
							onChange={onFieldChange}
							errorMessage={errors['email']}
							required
							autoComplete="email"
						/>
						<FormPassword
							name="password_1"
							label="Passwort"
							value={state['password_1']}
							onChange={onFieldChange}
							errorMessage={errors['password_1']}
							required
							autoComplete="off"
						/>
						<FormPassword
							name="password_2"
							label="Passwort wiederholen"
							value={state['password_2']}
							onChange={onFieldChange}
							errorMessage={errors['password_2']}
							required
							autoComplete="off"
						/>
					</Grid>
				</div>
			</fieldset>

			{/*
				We use the isUntouched or isValid state to enable/disable the submit button only visually.
				We don't want to disable the button completely, because then the user wouldn't be able to see the errors.
			*/}
			<div className={['flex-1', isUntouched || isValid ? 'opacity-50' : undefined].join(' ')}>
				<Button size="L" type="submit" colorScheme="gradient" icon="send" disabled={isSubmitting}>
					Speichern
				</Button>
			</div>
		</Form>
	);
};
