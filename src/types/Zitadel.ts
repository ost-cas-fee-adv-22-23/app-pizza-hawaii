/* Zitadel types */

export type TZitadelUser = {
	userName: string;
	profile: TZitadelProfile;
	email: TZitadelEmail;
	phone?: TZitadelPhone;
	password?: string;
	hashedPassword?: TZitadelHashedPassword;
	passwordChangeRequired?: boolean;
	requestPasswordlessRegistration?: boolean;
	otpCode?: string;
	idps?: TZitadelIdp[];
};

export type TZitadelEmail = {
	email: string;
	isEmailVerified: boolean;
};

export type TZitadelPhone = {
	phone: string;
	isPhoneVerified: boolean;
};

export type TZitadelHashedPassword = {
	value: string;
	algorithm: string;
};

export type TZitadelProfile = {
	firstName: string;
	lastName: string;
	displayName: string;
	avatarUrl?: string;
	gender?: 'GENDER_UNSPECIFIED' | 'GENDER_FEMALE' | 'GENDER_MALE' | 'GENDER_DIVERSE';
	nickName?: string;
	preferredLanguage?: string;
};

export type TZitadelIdp = {
	configId: string;
	externalUserId: string;
	displayName: string;
};

/* Example of a Zitadel user */
// {
//   "userName": "minnie-mouse",
//   "profile": {
//     "firstName": "Minnie",
//     "lastName": "Mouse",
//     "nickName": "Mini",
//     "displayName": "Minnie Mouse",
//     "preferredLanguage": "en",
//     "gender": "GENDER_FEMALE"
//   },
//   "email": {
//     "email": "minnie@mouse.com",
//     "isEmailVerified": true
//   },
//   "phone": {
//     "phone": "+41 71 000 00 00",
//     "isPhoneVerified": true
//   },
//   "password": "string",
//   "hashedPassword": {
//     "value": "string",
//     "algorithm": "string"
//   },
//   "passwordChangeRequired": true,
//   "requestPasswordlessRegistration": true,
//   "otpCode": "string",
//   "idps": [
//     {
//       "configId": "idp-config-id",
//       "externalUserId": "idp-config-id",
//       "displayName": "minnie.mouse@gmail.com"
//     }
//   ]
// }
