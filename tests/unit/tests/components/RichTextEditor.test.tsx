import { Richtext } from '@smartive-education/pizza-hawaii';
import { cleanup, render, screen } from '@testing-library/react';

import { parse as parseRichText } from '../../../../src/utils/RichText';

/**
 * Unit tests for the Richtext component.
 *
 * Basically we want to know if all the different input types are rendered correctly.
 * We test the following on Richtext
 * 1. Render component with text
 * 2. Render component with correct font size class
 * 3. Render component against snapshot
 *
 * We test the following on the parse function
 * 1. Test link parser
 * 2. Test hash tag parser
 * 3. Test user mention parser
 * 4. Test markdown link parser
 * 5. Test line break parser
 *
 **/

export const defaultSettings = {
	basics: true,
	links: true,
	markdownLinks: true,
	tags: true,
	mentions: true,
	tagLinkPattern: '/tag/$1',
	mentionLinkPattern: '/user/$3',
};

const examples = {
	simple: 'hi there, I am a great fan of pizza hawaii.',
	hashTag: 'hi there, I am a great fan of pizza hawaii. #pizza #hawaii',
	link: 'hi there, I want to share that https://example.com is a great website.',
	userMention: 'hi there, I want to share that @[Testuser|214652397815857409] is a crappy website.',
	markdown: 'hi there, I want to share that [lookatthat](https://lookatthat.ch) is a simple website.',
	withBreaks: 'hi there, I want to share that long text with a line- \n, break and a pizza slize 🍕.',
};

// Richtext Component rendering tests
describe('Richtext Component input rendering', () => {
	afterEach(cleanup);
	// test plain text URLs to anchor tags creation when links are posted
	it('should render the simple text', () => {
		render(<Richtext size="M">{examples.simple}</Richtext>);
		expect(screen.getByText(examples.simple));
	});

	// test correct font size class
	it('should render the correct style', () => {
		const { container } = render(<Richtext size="M">{examples.simple}</Richtext>);
		expect(container.getElementsByClassName('font-medium leading-normal text-l')).toHaveLength(1);
	});

	// test snapshot
	it('should match the snapshot', () => {
		const { container } = render(<Richtext size="M">{examples.link}</Richtext>);
		expect(container).toMatchSnapshot();
	});
});

// Richtext parse function tests
describe('test parseRichText functions', () => {
	it('test link parser', () => {
		expect(parseRichText('https://example.com')).toBe('<p><a href="https://example.com">https://example.com</a></p>');

		expect(parseRichText(examples.link)).toBe(
			`<p>${examples.link.replace('https://example.com', '<a href="https://example.com">https://example.com</a>')}</p>`
		);
	});

	it('test hash tag parser', () => {
		expect(parseRichText('#pizza')).toBe('<p><a href="/tag/pizza">#pizza</a></p>');

		expect(parseRichText(examples.hashTag)).toBe(
			`<p>${examples.hashTag
				.replace('#pizza', '<a href="/tag/pizza">#pizza</a>')
				.replace('#hawaii', '<a href="/tag/hawaii">#hawaii</a>')}</p>`
		);
	});

	it('test user mentions link', () => {
		expect(parseRichText('@[User|000000]')).toBe('<p><a href="/user/000000">@User</a></p>');

		expect(parseRichText(examples.userMention)).toBe(
			`<p>${examples.userMention.replace(
				'@[Testuser|214652397815857409]',
				'<a href="/user/214652397815857409">@Testuser</a>'
			)}</p>`
		);
	});

	it('test markdown link', () => {
		expect(parseRichText('[Ein Test](https://test.ch)')).toBe('<p><a href="https://test.ch">Ein Test</a></p>');

		expect(parseRichText(examples.markdown)).toBe(
			`<p>${examples.markdown.replace(
				'[lookatthat](https://lookatthat.ch)',
				'<a href="https://lookatthat.ch">lookatthat</a>'
			)}</p>`
		);
	});

	it('test line breaks', () => {
		expect(parseRichText('foo\nbar')).toBe('<p>foo<br>bar</p>');

		expect(parseRichText(examples.withBreaks)).toBe(`<p>${examples.withBreaks.replace('\n', '<br>')}</p>`);
	});
});
