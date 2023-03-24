import { FC, useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import NextLink from 'next/link';
import Image from 'next/image';

import MumbleLogo from '../assets/svg/mumbleLogo.svg';
import { Grid, RoundButton, Icon, Link } from '@smartive-education/pizza-hawaii';

import { useThemeContext, THEME } from '../context/useTheme';

type TFooter = {};

export const Footer: FC<TFooter> = () => {
	const { theme, setTheme } = useThemeContext();

	function handleToggleTheme() {
		setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
	}
	return (
		<footer className="Footer">
			<div className="px-content py-3">
				<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
					<Grid variant="row" gap="M" centered={true}>
						<p>
							<MumbleLogo className="w-32" />
							Made with{' '}
							<span className="text-pink-600">
								<Icon name={'heart_filled'} />
							</span>{' '}
							by{' '}
							<Link href="https://github.com/flxtagi" target="_blank" component={NextLink}>
								Felix Adam
							</Link>{' '}
							and{' '}
							<Link href="https://github.com/rudigier" target="_blank" component={NextLink}>
								Jürgen Rudigier
							</Link>
							.
						</p>
						<div>
							<RoundButton
								as="button"
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
