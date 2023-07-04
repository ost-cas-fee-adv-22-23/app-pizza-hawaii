import '@testing-library/jest-dom';
import { cleanup, fireEvent, queryByAttribute, render, waitFor } from '@testing-library/react';
import React from 'react';

import { AccountForm, TAccountFormData } from '../../../../src/components/form/AccountForm';
/**
 * Unit tests for the AccountForm component.
 *
 * Basically we want to ensure the functionality of the form.
 * We test the following on AccountForm component:
 * 1. Render with a provided user as expected (all fields filled, right field names, etc.)
 * 2. Render with an empty user, check if the submit button is (visually) disabled, fill all fields and check if submit button is enabled
 * 3. Render with non matching passwords, check if error message is shown
 *
 *
 **/
const propsUser = {
	user: {
		password: 'strongPA$$W0RD',
		confirmPassword: 'strongPA$$W0RD',
		userName: 'Filiks',
		email: 'filiks.adamski@mumble.ch',
		firstName: 'Felix',
		lastName: 'Adam',
	} as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

const propsEmptyUser = {
	user: {
		password: '',
		confirmPassword: '',
		userName: '',
		email: '',
		firstName: '',
		lastName: '',
	} as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

const propsWrongUser = {
	...propsUser,
	user: {
		...propsUser.user,
		confirmPassword: 'strongPA$$--',
	} as TAccountFormData,
};

const getById = queryByAttribute.bind(null, 'id');

describe('AccountForm', () => {
	afterEach(cleanup);

	test('renders component with all fields filled, check correct field names and values', () => {
		const { container } = render(<AccountForm {...propsUser} />);

		// for each key in the user object, we want to check if the value is set correctly
		Object.keys(propsUser.user).forEach((key) => {
			const input = container.querySelector(`input[name="${key}"]`);
			expect(input).toHaveProperty('value', propsUser.user[key as keyof TAccountFormData]);
		});
	});

	test('renders component with empty user, check if submit button is (visually) disabled, fill all fields and check if submit button is enabled', async () => {
		const { container } = render(<AccountForm {...propsEmptyUser} />);

		const button = container.querySelector('button[type="submit"]');
		const buttonContainer = button?.parentElement;

		// check if button is disabled
		await waitFor(() => expect(buttonContainer).toHaveClass('opacity-50'));

		// for each key in the user object, we trigger a change event on the input field
		Object.keys(propsUser.user).forEach((key) => {
			const input = container.querySelector(`input[name="${key}"]`);

			fireEvent.change(input as HTMLInputElement, {
				target: { value: propsUser.user[key as keyof TAccountFormData] },
			});
		});

		// check if button is enabled
		await waitFor(() => expect(buttonContainer).not.toHaveClass('opacity-50'));
	});

	// renders component with non matching passwords, check if error message is shown
	test('if two different passwords are entered, the input field text is red', () => {
		const { container } = render(<AccountForm {...propsWrongUser} />);
		const confirmPasswordField = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement;

		expect(confirmPasswordField).toHaveClass('text-error-red');
		expect(confirmPasswordField).toHaveAttribute('aria-invalid', 'true');

		// get the error message via the aria-describedby attribute
		const describedBy = confirmPasswordField.getAttribute('aria-describedby');
		const errorMessage = getById(container, describedBy as string);
		expect(errorMessage).toBeInTheDocument();

		expect(errorMessage).toHaveTextContent('Die Passwörter stimmen nicht überein.');
	});
});
