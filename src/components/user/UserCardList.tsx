import { Grid } from '@smartive-education/pizza-hawaii';
import React, { FC } from 'react';

import { TUser } from '../../types';
import { UserCard } from './UserCard';
import { UserCardSkeleton } from './UserCardSkeleton';

type TUserCardList = {
	users: TUser[];
	loadingItems?: number;
	noUsersMessage?: string;
};

export const UserCardList: FC<TUserCardList> = ({
	users,
	loadingItems = 0,
	noUsersMessage = 'No users in this list.',
}: TUserCardList) => {
	if (!users?.length && loadingItems === 0) {
		return <p>{noUsersMessage}</p>;
	}

	return (
		<Grid variant="row" gap="S" marginBelow="L">
			<div className="flex-1 flex flex-row flex-wrap -m-2">
				{loadingItems > 0
					? Array.from(Array(loadingItems).keys()).map((i) => (
							<div key={i} className="flex-initial w-4/12 p-2 sm:w-1/2">
								<UserCardSkeleton key={i} />
							</div>
					  ))
					: users.map((user) => (
							<div key={user.id} className="flex-initial w-4/12 p-2 sm:w-1/2">
								<UserCard key={user.id} user={user} />
							</div>
					  ))}
			</div>
		</Grid>
	);
};
