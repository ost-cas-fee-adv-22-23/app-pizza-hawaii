import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';

import { zitadelService } from '../../services/api/zitadel';
import { usersService } from '../../services/users';
import { TUser } from '../../types';
import { TUserFormData, UserForm } from './UserForm';

type TUserSettings = {
	setSuccess?: () => void;
	onCancel?: () => void;
};

const UserSettings: FC<TUserSettings> = ({ setSuccess, onCancel }) => {
	const [user, setUser] = useState<TUserFormData>();
	const [isLoading, setIsLoading] = useState(true);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	useEffect(() => {
		setIsLoading(true);

		(async () => {
			// Get user profile
			const userProfile = await zitadelService.getUserProfile();

			// Set user form data
			setUser({
				userName: userProfile.userName,
				email: userProfile.email.email,
				firstName: userProfile.profile.firstName,
				lastName: userProfile.profile.lastName,
			});

			setIsLoading(false);
		})();
	}, []);

	const onSubmit = async (formData: TUserFormData) => {
		// Update user
		const res = await zitadelService.updateUserProfile({
			userName: formData.userName, // get always error from zitadel
			email: {
				email: formData.email,
			},
			profile: {
				firstName: formData.firstName,
				lastName: formData.lastName,
				displayName: `${formData.firstName} ${formData.lastName}`,
			},
		});

		const data = await res.json();

		if (res.status !== 200) {
			const props = ['userName', 'firstName', 'lastName', 'email'];

			// loop through all props and check if there is an error
			props.forEach((prop) => {
				console.log(1);
				if (data.errors?.[prop]) {
					console.log(2);
					if (data.errors[prop].toLowerCase().includes(`.${prop.toLowerCase()}`)) {
						// set error
						console.log(3);
						data.errors[prop] = data.errors[prop].split(':')[1].trim();
					}
				}
			});

			return { ...data, status: false };
		}

		// invalidate cache for user
		usersService.invalidateUserCache(currentUser.id);

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
