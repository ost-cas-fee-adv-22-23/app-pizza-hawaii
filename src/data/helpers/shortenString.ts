const shortenString = (text: string, maxLength: number, toWord = false) => {
	if (text.length <= maxLength) {
		return text;
	}

	// shorten to the nearest word if toWord is true
	return `${text.substring(0, toWord ? text.lastIndexOf(' ', maxLength) : maxLength)}...`;
};

export default shortenString;
