import { TPost, TUser } from '../types';

export const UserCardModel = (userData) => {
	
	console.log('UserCardModel', userData);
	if (userData) return null;

	const emptyUser = {
		id: '',
		userName: '',
		firstName: '',
		lastName: '',
		avatarUrl: '',
		profileLink: '',
	};

	return {
			id: userData.id,
			userName: userData.userName,
			firstName: userData.firstName,
			lastName: userData.LastName,
			avatarUrl: userData.avatarUrl,
			createdAt: new Date().toISOString(),
			backgroundImage: '//picsum.photos/seed/johndoe1/1600/1157/',
			profileLink: '',

	};
};
