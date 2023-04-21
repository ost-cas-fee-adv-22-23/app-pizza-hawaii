import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import { useFolloweeContext } from '../../context/useFollowee';
import { services } from '../../services';
import { TUser } from '../../types';
import { UserCardList } from '../user/UserCardList';

export const FollowerList = () => {
	const { followees } = useFolloweeContext();
	const [users, setUsers] = useState<TUser[]>([]);

	const { data: session } = useSession();
	const accessToken = session?.accessToken;

	useEffect(() => {
		const fetchUsers = async () => {
			if (accessToken) {
				try {
					const users = await services.api.users.users({
						userIds: followees,
					});
					setUsers(users);
				} catch (error) {
					console.error(error);
				}
			}
			return () => {
				setUsers([]);
			};
		};

		fetchUsers();
	}, [accessToken, followees]);

	return <UserCardList users={users} />;
};
