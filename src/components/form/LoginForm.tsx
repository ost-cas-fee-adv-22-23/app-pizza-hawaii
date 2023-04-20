import { Button, Form, FormInput, Label } from '@smartive-education/pizza-hawaii';
import React, { FC, FormEvent, useState } from 'react';

export type TLoginFormData = {
	email: string;
};

export type TLoginFormErrors = { [key in keyof TLoginFormData]?: string };

export type TLoginForm = {
	onSubmit: (data: TLoginFormData) => { status: boolean; errors?: TLoginFormErrors };
	data?: TLoginFormData;
	sectionLabel?: string;
	isLoading?: boolean;
};

const emptyState: TLoginFormData = {
	email: '',
};

export const LoginForm: FC<TLoginForm> = ({ onSubmit, data = emptyState, sectionLabel }) => {
	const [state, setState] = useState(data);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<TLoginFormErrors>({});

	const onSubmitHandler = (e: FormEvent) => {
		e.preventDefault();

		setIsSubmitting(true);

		// submit form
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
			<Label as="legend" size="XL">
				{sectionLabel || 'Login'}
			</Label>
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

			<Button size="L" type="submit" colorScheme="gradient" icon="mumble" disabled={isSubmitting}>
				Login
			</Button>
		</Form>
	);
};
