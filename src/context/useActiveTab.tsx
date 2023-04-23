import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

type TActiveTabContextProps = {
	children: ReactElement;
};

type TActiveTabContextData = {
	isActive: boolean;
};

const ActiveTabContext = createContext({} as TActiveTabContextData);
export const ActiveTabContextProvider = ({ children }: TActiveTabContextProps) => {
	const [active, setActive] = useState<boolean>(false);

	const onVisibilityChange = () => {
		setActive(!document.hidden);
	};

	// add event listener to check if the tab is active
	useEffect(() => {
		onVisibilityChange();

		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, []);

	return <ActiveTabContext.Provider value={{ isActive: active }}>{children}</ActiveTabContext.Provider>;
};

export const useActiveTabContext = () => useContext(ActiveTabContext);
