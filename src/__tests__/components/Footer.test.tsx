// test render footer
import { cleanup, render, screen } from '@testing-library/react';

import { Footer } from '@/components/base/Footer';

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

	it('should have a HTML element footer and the className of `Footer` ', () => {
		const { container } = render(<Footer />);
		expect(container.querySelector('footer'));
	});
});
