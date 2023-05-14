import { Button, Form, FormInput, FormPassword, Grid } from '@smartive-education/pizza-hawaii';
import React, { FC, FormEvent, useEffect, useState } from 'react';

export type TAccountFormData = {
	password: string;
	confirmPassword: string;
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
};

type TAccountFormDataKeys = keyof TAccountFormData;

export type TAccountFormErrors = { [key in keyof TAccountFormData]?: string };

export type TAccountForm = {
	onSubmit: (data: TAccountFormData) => { status: boolean; errors?: TAccountFormErrors };
	onCancel?: () => void;
	user?: TAccountFormData;
	isLoading?: boolean;
};

const emptyState: TAccountFormData = {
	password: '',
	confirmPassword: '',
	userName: '',
	email: '',
	firstName: '',
	lastName: '',
};

export const AccountForm: FC<TAccountForm> = ({ onSubmit, user = emptyState, isLoading }) => {
	const [state, setState] = useState(user);
	const [isUntouched, setIsUntouched] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<TAccountFormErrors>({});

	useEffect(() => {
		setState(user);
	}, [user]);

	useEffect(() => {
		// check if all fields are empty
		const isEmpty = Object.values(state).every((value) => value === '');

		// if there are no validation errors and
		// the form is not empty, set isValid to true
		setIsValid(Object.keys(errors).length === 0 && !isEmpty);
	}, [state, errors]);

	useEffect(() => {
		// check if passwords match
		if (state.password !== state.confirmPassword) {
			setErrors((prev) => ({ ...prev, confirmPassword: 'Die Passwörter stimmen nicht überein.' }));
		} else {
			setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
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

		// check if form is untouched
		const isUntouched = Object.entries(state).every(([key, value]) => value === user[key as TAccountFormDataKeys]);
		setIsUntouched(isUntouched);
	};

	return (
		<Form onSubmit={onSubmitHandler} noValidate>
			<div className={['mt-4', isLoading && 'opacity-50 animate-pulse'].join(' ')}>
				<Grid variant="col" gap="M" marginBelow="M">
					<FormInput
						name="firstName"
						label="First Name"
						type="text"
						value={state['firstName']}
						onChange={onFieldChange}
						errorMessage={errors['firstName']}
						required
						autoComplete="given-name"
					/>
					<FormInput
						name="lastName"
						label="Last Name"
						type="text"
						value={state['lastName']}
						onChange={onFieldChange}
						errorMessage={errors['lastName']}
						required
						autoComplete="family-name"
					/>
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
						label="E-Mail"
						type="email"
						value={state['email']}
						onChange={onFieldChange}
						errorMessage={errors['email']}
						required
						autoComplete="email"
					/>
					<FormPassword
						name="password"
						label="Passwort"
						value={state['password']}
						onChange={onFieldChange}
						errorMessage={errors['password']}
						required
						autoComplete="off"
					/>
					<FormPassword
						name="confirmPassword"
						label="Passwort wiederholen"
						value={state['confirmPassword']}
						onChange={onFieldChange}
						errorMessage={errors['confirmPassword']}
						required
						autoComplete="off"
					/>
				</Grid>
			</div>

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
