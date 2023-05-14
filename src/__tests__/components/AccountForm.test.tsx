import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { AccountForm, TAccountFormData } from '../../components/form/AccountForm';
import formDataEmptyUser from '@/__mocks__/formDataEmptyUser.json';
import formDataUser from '@/__mocks__/formDataUser.json';
import formWrongDataUser from '@/__mocks__/formWrongDataUser.json';

const propsUser = {
	user: formDataUser as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

const propsEmptyUser = {
	user: formDataEmptyUser as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

const propsWrongUser = {
	user: formWrongDataUser as TAccountFormData,
	onSubmit: jest.fn(),
	isLoading: false,
};

describe('AccountForm with a provided user', () => {
	afterEach(cleanup);
	test('renders AccountForm component with first and last Name field with value', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		expect(container.querySelector('input[name="firstName"]')).toHaveProperty('value', 'Felix');
		expect(container.querySelector('input[name="lastName"]')).toHaveProperty('value', 'Adam');
	});

	test('renders AccountForm submitButton if all fields are filled', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
	});

	test('if matches snapshot of Form', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		expect(container).toMatchSnapshot();
	});

	test('renders AccountForm with empty fields if no user Data is provided', () => {
		const { container } = render(<AccountForm {...propsEmptyUser} />);
		expect(container.querySelector('input[name="firstName"]')).toHaveProperty('value', '');
		expect(container.querySelector('input[name="lastName"]')).toHaveProperty('value', '');
	});

	test('if two different passwords are entered, the input field text is red`', () => {
		const { container } = render(<AccountForm {...propsWrongUser} />);
		expect(container.querySelector('input[name="password"]')).toHaveProperty('value', 'strongPA$$W0RD');
		expect(container.querySelector('input[name="confirmPassword"]')).toHaveProperty('value', 'strongPA$$--');
		expect(container.querySelector('input[name="confirmPassword"]')).toHaveClass('text-error-red');
	});

	// the non-null-assertion operator ! is used to make the test working which indicates
	// that the value is actually not null
	test('state of form is updated when user types in input field', () => {
		const { container } = render(<AccountForm {...propsUser} />);
		const firstNameInput = container.querySelector('input[name="firstName"]');
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fireEvent.change(firstNameInput!, { target: { value: 'Martin' } });
		expect(firstNameInput).toHaveProperty('value', 'Martin');
	});
});
