// Description: This file contains a function that converts plain text to rich text (HTML) with links, mentions, hashtags, etc.

export type RichtextSettings = {
	basics?: boolean;
	links?: boolean;
	markdownLinks?: boolean;
	tags?: boolean;
	mentions?: boolean;
	tagLinkPattern?: string;
	mentionLinkPattern?: string;
};

// Default settings for the Richtext parser (we export them so that you can use them as a base for your own settings)
export const defaultSettings: RichtextSettings = {
	basics: true,
	links: true,
	markdownLinks: true,
	tags: true,
	mentions: true,
	tagLinkPattern: '/tag/$1',
	mentionLinkPattern: '/user/$3',
};

export const parse = (plainText: string, settings: RichtextSettings = defaultSettings): string => {
	let richText = plainText;

	if (settings.markdownLinks) {
		// Convert Markdown-Links in the text and replace with anchor tags (e.g. [Link](https://example.com)) to <a href="https://example.com">Link</a>
		richText = richText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
	}

	if (settings.links) {
		// Convert plain text URLs to anchor tags (e.g. https://example.com) to <a href="https://example.com">https://example.com</a> do not change already existing links
		richText = richText.replace(/(?<!href=")(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
	}

	if (settings.tags) {
		// Convert Hashtag-Links in the text and wrap with anchor tags (e.g. #tag) to <a href="/tag/tag">#tag</a>
		richText = richText.replace(/#(\w+)/g, `<a href="${settings.tagLinkPattern}">#$1</a>`);
	}

	if (settings.mentions) {
		// Convert @-mentions in the text and wrap with anchor tags. (e.g. @[JohnDoe|123]) to <a href="/user/123">@JohnDoe</a>
		richText = richText.replace(/@(\[(\w+)\|(\d+)\])/g, `<a href="${settings.mentionLinkPattern}">@$2</a>`);
	}

	if (settings.basics) {
		// Add paragraph tags to the text
		richText = `<p>${richText.split('\n\n').join('</p><p>')}</p>`;

		// Replace newline characters with line break tags
		richText = richText.replace(/\n/g, '<br>');
	}

	return richText;
};
