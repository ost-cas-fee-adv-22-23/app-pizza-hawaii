import React, { FC, useEffect, useState } from 'react';
import { UserForm, TUserFormData } from './UserForm';

type TUserSettings = {
	setSuccess?: () => void;
};
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const UserSettings: FC<TUserSettings> = ({ setSuccess }) => {
	const [user, setUser] = useState<TUserFormData>();

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
		setUser(data);

		return data;
	};

	const updateUser = async (data: TUserFormData) => {
		try {
			const res = await fetch(`${BASE_URL}/api/profile`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				throw new Error(`Failed to update user: ${res.statusText}`);
			}
			const updatedUser = await res.json();

			return updatedUser;
		} catch (error) {
			throw new Error(error as string);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	const onSubmit = (data: TUserFormData) => {
		console.log('onSubmit', data);

		// Update user
		const updateFN = async () => {
			const updatedUser = await updateUser(data);
			setUser(updatedUser);
		};

		updateFN();

		// Call setSuccess if it was passed
		setSuccess && setSuccess();

		// Return true to indicate that the form was submitted successfully for a few milliseconds
		return { status: true };
	};

	return <UserForm user={user as TUserFormData} onSubmit={onSubmit} />;
};

export default UserSettings;
