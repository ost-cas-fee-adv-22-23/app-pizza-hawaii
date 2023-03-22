import { useThemeContext, THEME } from '../context/useTheme';

export function ThemeSwitch() {
	const { theme, setTheme } = useThemeContext();

	function handleToggleTheme() {
		setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
	}

	return <button onClick={handleToggleTheme}>{theme === THEME.DARK ? 'light' : 'dark'}</button>;
}
