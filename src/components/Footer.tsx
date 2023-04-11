import { Grid, Icon, Link, RoundButton } from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import { FC } from 'react';

import { THEME, useThemeContext } from '../context/useTheme';

export const Footer: FC = () => {
	const { theme, toggleTheme } = useThemeContext();

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
								onClick={toggleTheme}
								buttonLabel={theme === THEME.DARK ? 'Light Mode' : 'Dark Mode'}
							/>
						</div>
					</Grid>
				</div>
			</div>
		</footer>
	);
};
