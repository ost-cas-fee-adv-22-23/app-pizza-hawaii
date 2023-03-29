import { useThemeContext, THEME } from '../context/useTheme';

export function ThemeSwitch() {
	const { theme, toggleTheme } = useThemeContext();

	return <button onClick={toggleTheme}>{theme === THEME.DARK ? 'Light Mode' : 'Dark Mode'}</button>;
}
