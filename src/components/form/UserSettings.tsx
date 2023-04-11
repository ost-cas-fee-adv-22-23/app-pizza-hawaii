import { Modal } from '@smartive-education/pizza-hawaii';
import React, { FC } from 'react';

import { TUser } from '../../types';
import { TUserFormData, UserForm } from './UserForm';

type TUserSettings = {
	user: TUser;
	onClose: () => void;
};

const UserSettings: FC<TUserSettings> = ({ user, onClose }) => {
	const onSubmit = (data: TUserFormData) => {
		console.log(data);

		// If there are no errors, go to the next step
		//set

		// Return true to indicate that the form was submitted successfully for a few milliseconds
		return { status: true };
	};

	return (
		<Modal title="Einstellungen" isVisible={true} onClose={onClose}>
			<UserForm user={user} onSubmit={onSubmit} />
		</Modal>
	);
};

export default UserSettings;
