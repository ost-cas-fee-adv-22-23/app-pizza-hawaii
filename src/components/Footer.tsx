import { FC } from 'react';
import NextLink from 'next/link';

import { Grid, RoundButton, Icon, Link } from '@smartive-education/pizza-hawaii';

import { useThemeContext, THEME } from '../context/useTheme';

export const Footer: FC = () => {
	const { theme, setTheme } = useThemeContext();

	function handleToggleTheme() {
		setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
	}
	return (
		<footer className="Footer">
			<div className="px-content py-3">
				<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
					<Grid variant="row" gap="M" centered={true} wrapBelowScreen="md">
						<p className="flex-1">
							Made with{' '}
							<span className="text-pink-600">
								<Icon name={'heart_filled'} />
							</span>{' '}
							by{' '}
							<Link href="https://github.com/flxtagi" newTab={true} component={NextLink}>
								Felix Adam
							</Link>{' '}
							and{' '}
							<Link href="https://github.com/rudigier" newTab={true} component={NextLink}>
								Jürgen Rudigier
							</Link>
							.
						</p>
						<div>
							<RoundButton
								colorScheme="slate"
								icon="eye"
								onClick={handleToggleTheme}
								buttonLabel={theme === THEME.DARK ? 'Light Mode' : 'Dark Mode'}
							/>
						</div>
					</Grid>
				</div>
			</div>
		</footer>
	);
};
