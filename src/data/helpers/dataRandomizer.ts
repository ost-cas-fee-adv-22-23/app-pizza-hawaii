/**
 * Helper function to get a random swiss city, date and life story because we don't have a database (yet)
 * so it helps to fill the profile page with some fake-data but still looks like a real profile.
 * @returns hometown, memberSince, shortBio
 */

export const homeTown = () => {
	const swissCities = [
		'Zürich',
		'St. Gallä',
		'Bärn',
		'Wil',
		'Wallisellen',
		'Winterthur',
		'Lyss',
		'Schaffhausen',
		'Sion',
		'Kilchberg',
	];

	const randomNumber = Math.floor(Math.random() * swissCities.length);

	const homeTown = swissCities[randomNumber];
	return homeTown;
};

export const memberSince = () => {
	const randomNumber = new Date(
		2022 + Math.random(),
		Math.floor(Math.random() * 12),
		Math.floor(Math.random() * 30)
	).toISOString();

	const memberSince = randomNumber;
	return memberSince;
};

export const shortBio = () => {
	const randomLifeStory = [
		'Internet geek. Friendly introvert. Prone to fits of apathy. Passionate thinker. Beer fan.',
		'Award-winning internet fanatic. General communicator. Tv maven. Incurable zombie practitioner.',
		'Mumble fanatic. Lifelong creator. Pop culture practitioner. Hardcore gamer. Zombie fan. TV aficionado.',
		'Lifelong baconaholic. Twitter & Mumble specialist. Pop culture advocate. Typical internet fanatic. Professional coffee scholar.',
		'Lifelong tv junkie. Zombie geek. Food ninja. Certified bacon lover. Travelaholic. Subtly charming web enthusiast.',
		'Friendly zombie specialist. Music geek. Bacon expert! Evil tv fanatic. Alcoholaholic.',
		'Gamer. Troublemaker. Hardcore food buff. Hipster-friendly creator. Falls down a lot. Alcohol geek. Organizer.',
		'Lifelong music buff. Falls down a lot. Web practitioner. Alcohol advocate. Beer fanatic.',
		'Mumble fan. Subtly charming alcohol lover. Lifelong organizer. Avid entrepreneur. Typical coffee fanatic.',
		'Music enthusiast. Subtly charming coffee buff. Incurable alcohol ninja. Food geek. Introvert.',
		'Incurable food ninja. Amateur zombie practitioner. Web buff. Certified social media lover. Beeraholic.',
		'Music evangelist. Prone to fits of apathy. Unapologetic bacon nerd. Award-winning introvert. Problem solver.',
		'Amateur social media Mumble maven. Extreme Snowboard advocate. Infuriatingly humble internet geek. Web fanatic. Creator.',
	];

	const randomNumber = Math.floor(Math.random() * randomLifeStory.length);
	const shortBio = randomLifeStory[randomNumber];
	return shortBio;
};
