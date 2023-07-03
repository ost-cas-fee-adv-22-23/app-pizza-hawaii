import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import { AccountForm, TAccountFormData } from '../../../../src/components/form/AccountForm';
/**
 * Unit tests for the AccountForm component.
 *
 * Basicly we want to ensure the functionality of the form.
 * We test the following on AccountForm component:
 * 1. Render the AccountForm component with a provided user
 * 2. Render the AccountForm component with a empty user
 * 3. Render the AccountForm component with a wrong user
 * 4. Render the AccountForm component with a loading state
 * 5. Render the AccountForm component with a disabled submit button
 * 6. Render the AccountForm component with a enabled submit button
 * 7. Render the AccountForm component with a disabled submit button if the passwords do not match
 * 8. Render the AccountForm component with a enabled submit button if the passwords match
 * 9. Render the AccountForm component with a disabled submit button if the email is not valid
 * 10. Render the AccountForm component with a enabled submit button if the email is valid
 * 11. Render the AccountForm component with a disabled submit button if the username is not valid
 * 12. Render the AccountForm component with a enabled submit button if the username is valid
 * 13. Render the AccountForm component with a disabled submit button if the firstname is not valid
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
	user: {
		...propsUser.user,
		email: 'wrong.email@here',
		confirmPassword: 'strongPA$$--',
	} as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

describe('AccountForm with a provided user', () => {
	afterEach(cleanup);
	// test if the form returns the correct values when submitted
	test('renders AccountForm component with first and last Name field with value', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		expect(container.querySelector('input[name="firstName"]')).toHaveProperty('value', 'Felix');
		expect(container.querySelector('input[name="lastName"]')).toHaveProperty('value', 'Adam');
	});

	// test if the submit button is disabled when the form is loaded. expect the button container to have the class `opacity-50`
	test('renders AccountForm component with disabled submit button when loading. The Visibility of Submitbutton is 50%', () => {
		const { container } = render(<AccountForm {...propsUser} isLoading={true} />);
		const buttonContainer = container.querySelector('.flex-1.opacity-50');
		expect(buttonContainer).toHaveClass('opacity-50');
		expect(container).toMatchSnapshot();
	});

	// test if the form subits empty strings when the form is empty
	test('renders AccountForm with empty fields if no user Data is provided', () => {
		const { container } = render(<AccountForm {...propsEmptyUser} />);
		expect(container.querySelector('input[name="firstName"]')).toHaveProperty('value', '');
		expect(container.querySelector('input[name="lastName"]')).toHaveProperty('value', '');
	});

	// test if the password maches the confirm password
	test('if two different passwords are entered, the input field text is red', () => {
		const { container } = render(<AccountForm {...propsWrongUser} />);
		expect(container.querySelector('input[name="password"]')).toHaveProperty('value', 'strongPA$$W0RD');
		expect(container.querySelector('input[name="confirmPassword"]')).toHaveProperty('value', 'strongPA$$--');
		expect(container.querySelector('input[name="confirmPassword"]')).toHaveClass('text-error-red');
	});

	// the non-null-assertion operator ! is used to make the test working which indicates
	// that the value is actually not null
	test('state of form is updated when user types in input field.', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		const firstNameInput = container.querySelector('input[name="firstName"]');
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fireEvent.change(firstNameInput!, { target: { value: 'Martin' } });
		expect(firstNameInput).toHaveProperty('value', 'Martin');
	});
});
