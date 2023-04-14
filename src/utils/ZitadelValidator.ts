import { TZitadelProfile } from '../types/Zitadel';

export type TGenderOption = {
	key: TZitadelProfile['gender'];
	text: string;
};

export const GenderOptions: TGenderOption[] = [
	{
		key: 'GENDER_UNSPECIFIED',
		text: '-',
	},
	{
		key: 'GENDER_FEMALE',
		text: 'Frau',
	},
	{
		key: 'GENDER_MALE',
		text: 'Herr',
	},
	{
		key: 'GENDER_DIVERSE',
		text: 'Divers',
	},
];
