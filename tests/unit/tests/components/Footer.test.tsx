import { cleanup, render, screen } from '@testing-library/react';

import { Footer } from '../../../../src/components/base/Footer';

/**
 * Unit tests for the Footer component
 *
 * These tests are written to make sure that the Footer component is rendered correctly.
 * Because if this simple component fails, everything fails. So it is the very Entry Point for our unit tests.
 * Because it will be rendered on every page, it is an ideal starting point for our unit tests.
 *
 * We test the following on Footer:
 * 1. Render Footer component with both great Authors in the footer text
 * 2. Theme toggle button is rendered
 * 3. Theme toggle button works as expected (adds the correct className to the body)
 * 4. Render Footer matching the Snapshot
 *
 **/

describe('Footer Component', () => {
	afterEach(cleanup);

	it('should render both great Authors in the footer text', () => {
		render(<Footer />);
		expect(screen.getByText('Felix Adam' && 'Jürgen Rudigier'));
	});

	it('should have a toggle theme button with the label `Toggle theme`', () => {
		render(<Footer />);
		expect(screen.getByRole('button', { name: 'Toggle theme' }));
		expect(screen.queryByLabelText('Toggle theme'));
	});

	it('should toggle the theme correctly', () => {
		render(<Footer />);
		const toggleThemeButton = screen.getByRole('button', { name: 'Toggle theme' });

		// we expect the body to have the class `light` by default
		expect(document.body.classList.contains('light'));

		// we expect the body to have the class `dark` after the toggle theme button is clicked
		toggleThemeButton.click();
		expect(document.body.classList.contains('dark'));

		// we expect the body to have the class `light` after the toggle theme button is clicked again
		toggleThemeButton.click();
		expect(document.body.classList.contains('light'));
	});

	it('should match the Snapshot', () => {
		const { container } = render(<Footer />);
		expect(container).toMatchSnapshot();
	});
});
