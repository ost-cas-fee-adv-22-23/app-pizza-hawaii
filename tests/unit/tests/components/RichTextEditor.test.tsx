import { Richtext } from '@smartive-education/pizza-hawaii';
import { cleanup, render, screen } from '@testing-library/react';

import { parse as parseRichText } from '../../../../src/utils/RichText';

/**
 * Unit tests for the Richtext component.
 *
 * Basicly we want to know if all the different input types are rendered correctly.
 * We test the following on Richtext
 * 1. Render Richtext component with text
 * 2. Render Richtext component with a link when a hastag is used in the text
 * 3. Render Richtext component with a link when a user is mentioned in the text
 * 4. Render Richtext component with a link when a url is used in the text
 * 5. Render Richtext component with the correct font size class
 * 6. Render Richtext component with the correct html tag when `as` prop is specified
 * 7. Render Richtext component when `size` prop is specified as `M` to have the correct css class
 * 8. Render Richtext component when a line break is used in the text
 * 9. Render Richtext component when markdown links are used in the text
 * 10. Render Richtext component when line breaks are used in the text
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

const inputDataHashTag = 'hi there, I am a great fan of pizza hawaii. #pizza #hawaii';
const inputDataLink = 'hi there, I want to share that https://example.com is a great website.';
const inputDataUserMention = 'hi there, I want to share that @[Testuser|214652397815857409] is a crappy website.';
const inputDataMarkdown = 'hi there, I want to share that [lookatthat](https://lookatthat.ch) is a simple website.';
const inputDatawithBreaks = 'hi there, I want to share that long text with a line- \n, break and a pizza slize 🍕.';

describe('Richtext Component input rendering', () => {
	afterEach(cleanup);
	// test if richtext component renders correctly
	it('should render the Richtext component with text', () => {
		render(
			<Richtext size="M" as="div">
				{inputDataHashTag}
			</Richtext>
		);
		expect(screen.getByText('hi there, I am a great fan of pizza hawaii. #pizza #hawaii'));
	});

	// test if the Richtext renders correct html tags if `as` prop is specified
	it('should render the Richtext component as `<article>` when specified', () => {
		const { container } = render(
			<Richtext size="M" as="article">
				{inputDataLink}
			</Richtext>
		);
		const articletag = container.querySelector('article');
		expect(articletag?.tagName).toBe('ARTICLE');
	});

	// same test as above but with `section` instead of `article`
	it('should render the Richtext component as `<section>` when specified', () => {
		const { container } = render(
			<Richtext size="M" as="section">
				{inputDataLink}
			</Richtext>
		);
		const sectiontag = container.querySelector('section');
		expect(sectiontag?.tagName).toBe('SECTION');
	});

	// test if the Richtext component renders correct font specific font classes with `size` prop is specified
	it('should render the Richtext component with `size` prop specified as `M` to have the correct css class', () => {
		const { container } = render(
			<Richtext size="M" as="div">
				{inputDataLink}
			</Richtext>
		);
		expect(container.getElementsByClassName('font-medium leading-normal text-l')).toHaveLength(1);
	});

	// test snapshot
	it('should match the snapshot', () => {
		const { container } = render(
			<Richtext size="M" as="div">
				{inputDataLink}
			</Richtext>
		);
		expect(container).toMatchSnapshot();
	});
});

// lets test the parse function
describe('test parseRichText functions', () => {
	afterEach(cleanup);
	// test plain text URLs to anchor tags creation when links are posted
	it('should return link anchor tag when links are posted, clutched by `paragraph-tags`', () => {
		const result = parseRichText(inputDataLink);
		expect(result).toBe(
			`<p>${inputDataLink.replace('https://example.com', '<a href="https://example.com">https://example.com</a>')}</p>`
		);
	});

	// test link creation when hash tags are used
	it('should return link creation when hash tags are used, clutched by `paragraph tags`', () => {
		const result = parseRichText(inputDataHashTag);
		expect(result).toBe(
			`<p>${inputDataHashTag
				.replace('#pizza', '<a href="/tag/pizza">#pizza</a>')
				.replace('#hawaii', '<a href="/tag/hawaii">#hawaii</a>')}</p>`
		);
	});

	// test user mentions link creation
	it('should return links to the corresponding user for all user mentions, clutched by `paragraph tags`', () => {
		const result = parseRichText(inputDataUserMention);
		expect(result).toBe(
			`<p>${inputDataUserMention.replace(
				'@[Testuser|214652397815857409]',
				'<a href="/user/214652397815857409">@Testuser</a>'
			)}</p>`
		);
	});

	// test markdown link creation
	it('should return created links for all markdown links clutched by `paragraph tags`', () => {
		const result = parseRichText(inputDataMarkdown);
		expect(result).toBe(
			`<p>${inputDataMarkdown.replace(
				'[lookatthat](https://lookatthat.ch)',
				'<a href="https://lookatthat.ch">lookatthat</a>'
			)}</p>`
		);
	});

	// test line breaks creation renders correctly
	it('should return replace line breaks with a `<br>`, clutched by `paragraph tags`', () => {
		const result = parseRichText(inputDatawithBreaks);
		expect(result).toBe(`<p>${inputDatawithBreaks.replace('\n', '<br>')}</p>`);
	});
});
