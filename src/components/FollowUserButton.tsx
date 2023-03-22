import React, { useState } from 'react';
import { Button } from '@smartive-education/pizza-hawaii';
/*
 * a really simple component as we dont have the follower information
 * but at least it looks cool.
 */

export const FollowUserButton = () => {
	const [isFollowing, setIsFollowing] = useState(false);

	return (
		<Button as="button" size="M" colorScheme="violet" onClick={() => setIsFollowing(!isFollowing)}>
			{isFollowing ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
