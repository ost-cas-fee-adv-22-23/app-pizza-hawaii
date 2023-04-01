import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

export const THEME = {
	LIGHT: 'light',
	DARK: 'dark',
};

type TThemeContextProps = {
	children: ReactElement;
};

type TThemeContextData = {
	theme: string | undefined;
	toggleTheme: () => void;
};

const ThemeContext = createContext({} as TThemeContextData);
export const ThemeContextProvider = ({ children }: TThemeContextProps) => {
	const [theme, setTheme] = useState<string | undefined>();

	// set the theme on mount
	useEffect(() => {
		// check if the user has a theme preference in local storage
		let newTheme = localStorage.getItem('theme');

		if (!newTheme) {
			// check if the user has a dark or light mode preference
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				newTheme = THEME.DARK;
			}
			if (window.matchMedia('(prefers-color-scheme: light)').matches) {
				newTheme = THEME.LIGHT;
			}
		}

		if (newTheme) {
			setTheme(newTheme);
		}
	}, []);

	// toggle the theme
	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove(THEME.LIGHT);
		root.classList.remove(THEME.DARK);

		if (!root || !theme) {
			return;
		}

		root.classList.add(theme);

		// save the theme in local storage
		localStorage.setItem('theme', theme);
	}, [theme]);

	function toggleTheme() {
		setTheme((prevTheme) => {
			return prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
		});
	}

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
