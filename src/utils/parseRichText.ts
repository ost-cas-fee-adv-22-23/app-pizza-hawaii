export type RichtextSettings = {
	basics?: boolean;
	links?: boolean;
	markdownLinks?: boolean;
	tags?: boolean;
	mentions?: boolean;
	tagLinkPattern?: string;
	mentionLinkPattern?: string;
};

const defaultSettings: RichtextSettings = {
	basics: true,
	links: true,
	markdownLinks: true,
	tags: true,
	mentions: false, // We can't use this feature because we don't have a username (yet)
	tagLinkPattern: '/tag/$1',
	mentionLinkPattern: '/user/$1',
};

const parseRichText = (plainText: string, settings: RichtextSettings = defaultSettings): string => {
	let richText = plainText;

	if (settings.links) {
		// Use a regular expression to find URLs in the text and replace URLs with anchor tags
		richText = richText.replace(/((https?:\/\/|www\.)[^\s]+)/g, '<a href="//$1">$1</a>');
	}

	if (settings.markdownLinks) {
		// Use a regular expression to find Markdown-Links in the text and replace with anchor tags
		richText = richText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
	}

	if (settings.tags) {
		// Use a regular expression to find Hashtag-Links in the text and wrap with anchor tags
		richText = richText.replace(/#(\w+)/g, `<a href="${settings.tagLinkPattern}">#$1</a>`);
	}

	if (settings.mentions) {
		// Use a regular expression to find @-mentions in the text and wrap with anchor tags
		richText = richText.replace(/@(\w+)/g, `<a href="${settings.mentionLinkPattern}">@$1</a>`);
	}

	if (settings.basics) {
		// Add paragraph tags to the text
		richText = `<p>${richText.split('\n\n').join('</p><p>')}</p>`;

		// Replace newline characters with line break tags
		richText = richText.replace(/\n/g, '<br>');
	}

	return richText;
};

export default parseRichText;
