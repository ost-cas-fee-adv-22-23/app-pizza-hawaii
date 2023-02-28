import { TPost, TUser } from '../types';

export const contentCardModel = (postData?: TPost, userData?: TUser): TPost | undefined => {
	if (!postData || !userData) return undefined;
	const emptyUser = {
		id: '',
		userName: '',
		firstName: '',
		lastName: '',
		avatarUrl: '',
		createdAt: '',
		profileLink: '',
	};
	return {
		...postData,
		creator: userData || emptyUser,
	};
};
