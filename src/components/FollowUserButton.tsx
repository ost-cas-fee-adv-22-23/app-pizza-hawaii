import React, { useEffect, useState } from 'react';
import { Button } from '@smartive-education/pizza-hawaii';
/*
 * a really simple component as we dont have the follower information
 * but at least it looks cool.
 */
type TFollowUserButton = {
	userId: string;
};

export const FollowUserButton = ({ userId }: TFollowUserButton) => {
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const currentFollowerId = getFollowers();
		if (currentFollowerId.includes(userId)) {
			setIsFollowing(true);
		}
	}, [userId]);

	const isFollowed = (userId: string) => {
		const currentFollowerId = getFollowers();
		return currentFollowerId.includes(userId);
	};

	// TODO: use a real database to store the followers and not localstorage :) (extend quacker API 2.0)

	const getFollowers = () => {
		return localStorage.getItem('followers')?.split(',') || [];
	};

	const setFollowers = (followerList: string[]) => {
		console.log(followerList);
		localStorage.setItem('followers', followerList.join(','));
	};

	const toggleFollow = (userId: string) => {
		// get the current followers from localstorage
		const currentFollowerId: string[] = getFollowers();

		let newFollowerList: string[] = [];

		const userFollows = isFollowed(userId);

		// if the user is not following the user, follow the user
		if (!userFollows) {
			// follow
			newFollowerList = [...currentFollowerId, userId];
		} else {
			// unFollow
			newFollowerList = currentFollowerId.filter((id) => id !== userId);
		}
		setFollowers(newFollowerList);
		setIsFollowing(!userFollows);
	};

	return (
		<Button size="M" colorScheme={isFollowing ? 'slate' : 'violet'} onClick={() => toggleFollow(userId)}>
			{isFollowing ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
