import React, { FC, useEffect, useState } from 'react';

import { TZitadelUser } from '../../types/Zitadel';
import { TUserFormData, UserForm } from './UserForm';

type TUserSettings = {
	setSuccess?: () => void;
	onCancel?: () => void;
};
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const UserSettings: FC<TUserSettings> = ({ setSuccess, onCancel }) => {
	const [user, setUser] = useState<TUserFormData>();
	const [isLoading, setIsLoading] = useState(true);

	const getUser = async () => {
		const res = await fetch(`${BASE_URL}/api/profile`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			throw new Error('Failed to fetch user info');
		}

		const data = await res.json();

		if (data) {
			setUser({
				userName: data.userName,
				email: data.email.email,
				firstName: data.profile.firstName,
				lastName: data.profile.lastName,
			});
		}
	};

	const updateUser = async (data: TUserFormData) => {
		try {
			const res = await fetch(`${BASE_URL}/api/profile`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userName: data.userName,
					email: {
						email: data.email,
					},
					profile: {
						firstName: data.firstName,
						lastName: data.lastName,
						displayName: `${data.firstName} ${data.lastName}`,
					},
				} as TZitadelUser),
			});

			if (!res.ok) {
				throw new Error(`Failed to update user: ${res.statusText}`);
			}
		} catch (error) {
			throw new Error(error as string);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		getUser().then(() => {
			setIsLoading(false);
		});
	}, []);

	const onSubmit = (data: TUserFormData) => {
		// Update user
		(async () => {
			await updateUser(data);
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
