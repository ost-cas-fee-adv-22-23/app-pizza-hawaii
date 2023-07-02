import { cleanup, render, screen } from '@testing-library/react';

import { Footer } from '../../components/base/Footer';

/**
 * Unit tests for the Footer component
 *
 * These tests are written to make sure that the Footer component is rendered correctly.
 * Because if this simple component fails, everything fails. So it is the very Entry Point for our unit tests.
 * Because it will be rendered on every page, it is an ideal starting point for our unit tests.
 *
 * We test the following on Footer:
 * 1. Render Footer component with both great Authors in the footer text
 * 2. Render Footer component with a toggle theme button
 * 3. Render Footer component with the correct html tag
 * 4. Render Footer component with the correct className if the toggle theme button is clicked
 * 5. Render Footer maching the Snapshot
 *
 **/

describe('Footer Component', () => {
	afterEach(cleanup);

	it('should render both great Authors in the footer text', () => {
		render(<Footer />);
		expect(screen.getByText('Felix Adam' && 'Jürgen Rudigier'));
		expect(screen.queryByLabelText('Toggle theme'));
	});

	it('should have a toggle theme button with the label `Toggle theme`', () => {
		render(<Footer />);
		expect(screen.getByRole('button', { name: 'Toggle theme' }));
		expect(screen.queryByLabelText('Toggle theme'));
	});

	it('should add a className `dark` and `light` to the html-body when the toggle theme button is clicked', () => {
		render(<Footer />);
		const toggleThemeButton = screen.getByRole('button', { name: 'Toggle theme' });
		toggleThemeButton.click();
		expect(document.body.classList.contains('dark'));
		toggleThemeButton.click();
		expect(document.body.classList.contains('light'));
	});

	it('should have a HTML element Footer and the className of `Footer` ', () => {
		const { container } = render(<Footer />);
		expect(container.querySelector('footer'));
	});

	it('should match the Snapshot', () => {
		const { container } = render(<Footer />);
		expect(container).toMatchSnapshot();
	});
});
