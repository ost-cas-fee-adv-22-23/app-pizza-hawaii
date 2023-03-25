import React, { FC } from 'react';
import { Card, Grid, Label, UserName, UserProfile } from '@smartive-education/pizza-hawaii';
import { FollowUserButton } from './FollowUserButton';
import { TUser } from '../types/User';

interface TUserCard {
	user: TUser;
}

export const UserCard: FC<TUserCard> = (props) => {
	const { user } = props;
	return (
		<Card as="div" rounded={true} size="S">
			<Grid variant="col" gap="M" centered={true}>
				<UserProfile
					userName={user.userName}
					avatar={user.avatarUrl}
					size="L"
					border={true}
					href={user.profileLink}
					buttonLabel="View Profile"
				/>
				<div className="flex flex-col gap-2">
					<Label as="span" size="M">
						{user.displayName}
					</Label>
					<span className="flex flex-row align-baseline gap-3">
						<UserName href={user.profileLink}>{user.userName}</UserName>
					</span>
				</div>

				<FollowUserButton userId={user.id} />
			</Grid>
		</Card>
	);
};
