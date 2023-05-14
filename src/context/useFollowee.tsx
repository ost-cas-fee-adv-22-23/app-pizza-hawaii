import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

type TFolloweeContextProps = {
	children: ReactElement;
};

type TFolloweeContextData = {
	followees: string[];
	isFollowee: (userId: string) => boolean;
	addFollowee: (userId: string) => void;
	removeFollowee: (userId: string) => void;
	toggleFollowee: (userId: string) => void;
};

const FolloweeContext = createContext({} as TFolloweeContextData);

export const FolloweeContextProvider = ({ children }: TFolloweeContextProps) => {
	const [followees, setFollowees] = useState<string[]>([]);

	// set the Followee on mount
	useEffect(() => {
		// check if followees are in local storage, split them and filter out empty strings
		let followeesData: string[] = localStorage.getItem('followees')?.split(',') || [];
		followeesData = followeesData?.filter((followee: string) => followee !== '');

		if (followeesData && followeesData.length > 0) {
			setFollowees(followeesData);
		}
	}, []);

	// set the Followee to local storage
	useEffect(() => {
		localStorage.setItem('followees', followees.join(','));
	}, [followees]);

	const isFollowee = (userId: string) => {
		return followees.includes(userId);
	};

	const addFollowee = (userId: string) => {
		setFollowees((prevFollowees: string[]) => [...prevFollowees, userId]);
	};

	const removeFollowee = (userId: string) => {
		setFollowees((prevFollowees: string[]) => prevFollowees.filter((followee: string) => followee !== userId));
	};

	const toggleFollowee = (userId: string) => {
		if (isFollowee(userId)) {
			removeFollowee(userId);
		} else {
			addFollowee(userId);
		}
	};

	return (
		<FolloweeContext.Provider value={{ followees, isFollowee, addFollowee, removeFollowee, toggleFollowee }}>
			{children}
		</FolloweeContext.Provider>
	);
};

export const useFolloweeContext = () => useContext(FolloweeContext);
