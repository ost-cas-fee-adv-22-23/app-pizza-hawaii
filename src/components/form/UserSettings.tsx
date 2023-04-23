import React, { FC, useEffect, useState } from 'react';

import { zitadelService } from '../../services/api/zitadel';
import { TUserFormData, UserForm } from './UserForm';

type TUserSettings = {
	setSuccess?: () => void;
	onCancel?: () => void;
};

const UserSettings: FC<TUserSettings> = ({ setSuccess, onCancel }) => {
	const [user, setUser] = useState<TUserFormData>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);

		(async () => {
			const userProfile = await zitadelService.getUserProfile();

			setUser({
				userName: userProfile.userName,
				email: userProfile.email.email,
				firstName: userProfile.profile.firstName,
				lastName: userProfile.profile.lastName,
			});

			setIsLoading(false);
		})();
	}, []);

	const onSubmit = (data: TUserFormData) => {
		// Update user
		(async () => {
			await zitadelService.updateUserProfile({
				userName: data.userName,
				email: {
					email: data.email,
				},
				profile: {
					firstName: data.firstName,
					lastName: data.lastName,
					displayName: `${data.firstName} ${data.lastName}`,
				},
			});
		})();

		// Call setSuccess if it was passed
		setSuccess && setSuccess();

		// Return true to indicate that the form was submitted successfully for a few milliseconds
		return { status: true };
	};

	return (
		<UserForm
			user={user as TUserFormData}
			onSubmit={onSubmit}
			onCancel={() => {
				onCancel && onCancel();
			}}
			isLoading={isLoading}
		/>
	);
};

export default UserSettings;
