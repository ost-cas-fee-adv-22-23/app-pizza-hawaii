import { cleanup, render, screen } from '@testing-library/react';

import { Footer } from '../../components/base/Footer';

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

	it('should have a HTML element footer and the className of `Footer` ', () => {
		const { container } = render(<Footer />);
		expect(container.querySelector('footer'));
	});

	it('should match the snapshot', () => {
		const { container } = render(<Footer />);
		expect(container).toMatchSnapshot();
	});
});
