import { Card, Grid, IconText, Label } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import React, { FC } from 'react';

import { TUser } from '../../types/User';
import { FollowUserButton } from '../widgets/FollowUserButton';
import { UserProfile } from './UserProfile';

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
					canEdit={false}
					buttonLabel="View Profile"
				/>
				<p className="grid overflow-hidden text-center whitespace-nowrap text-ellipsis w-full">
					<Label as="span" size="M">
						{user.displayName}
					</Label>
				</p>
				<p className="grid overflow-hidden whitespace-nowrap text-ellipsis w-full">
					<span className="flex flex-row align-baseline gap-3 justify-center">
						<NextLink href={user.profileLink} title={user.userName}>
							<IconText icon="profile" colorScheme="violet" size="S">
								{user.userName}
							</IconText>
						</NextLink>
					</span>
				</p>

				<FollowUserButton userId={user.id} />
			</Grid>
		</Card>
	);
};
