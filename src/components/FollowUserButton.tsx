import React, { useEffect, useState } from 'react';
import { Button } from '@smartive-education/pizza-hawaii';
/*
 * a really simple component as we dont have the follower information
 * but at least it looks cool.
 */
type TFollowUserButton = {
	userId: string;
};

import { useFolloweeContext } from '../context/useFollowee';

export const FollowUserButton = ({ userId }: TFollowUserButton) => {
	const [isFollowed, setIsFollowed] = useState<boolean>();
	const { toggleFollowee, isFollowee } = useFolloweeContext();

	useEffect(() => {
		userId && setIsFollowed(isFollowee(userId));
	}, [isFollowee, userId]);

	return (
		<Button size="M" colorScheme={isFollowed ? 'slate' : 'violet'} onClick={() => toggleFollowee(userId)}>
			{isFollowed ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
