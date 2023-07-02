import { Link, Modal, Navi, NaviButton } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { signOut } from 'next-auth/react';
import { FC, useState } from 'react';

import MumbleLogo from '../../../public/assets/svg/mumbleLogo.svg';
import { TUser } from '../../types';
import UserSettings from '../form/UserSettings';
import { UserProfile } from '../user/UserProfile';

type THeader = {
	user?: TUser;
};

export const Header: FC<THeader> = ({ user }) => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);

	const handleSettingsClick = (): void => {
		setShowSettingsModal(true);
	};

	if (!user) {
		return (
			<header className="Header mb-8 bg-violet-600 text-white">
				<div className="px-content py-3">
					<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
						<div className="flex w-[209px]">
							<Link href="/" component={NextLink}>
								<NextImage src={MumbleLogo} alt="Mumble Messenger" priority={true} />
								<h1 className="sr-only">Mumble</h1>
							</Link>
						</div>
						<nav className="">
							<Navi>
								<NaviButton
									component={NextLink}
									href="/auth/login"
									title="Login"
									icon="logout"
									data-testid="login-button-header"
								>
									Login
								</NaviButton>
								<NaviButton
									component={NextLink}
									href="/auth/signup"
									title="Sign Up"
									icon="mumble"
									data-testid="signup-button-header"
								>
									Sign Up
								</NaviButton>
							</Navi>
						</nav>
					</div>
				</div>
			</header>
		);
	}

	return (
		<>
			<header className="Header mb-8 sm:mb-4 bg-violet-600 text-white">
				<div className="px-content sm:px-6 py-3">
					<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
						<div className="flex w-[209px]">
							<Link href="/" component={NextLink}>
								<NextImage src={MumbleLogo} alt="Mumble Messenger" priority={true} />
								<h1 className="sr-only">Mumble</h1>
							</Link>
						</div>
						<nav className="">
							<Navi>
								<NaviButton component={NextLink} href={user.profileLink} title="My Mumble Profile">
									<UserProfile
										userName={user.userName}
										avatar={user.avatarUrl}
										size="S"
										buttonLabel="My Mumble Profile"
										canEdit={false}
										data-testid="profile-button-header"
									/>
								</NaviButton>
								<NaviButton
									icon="settings"
									onClick={handleSettingsClick}
									data-testid="settings-button-header"
								>
									Settings
								</NaviButton>
								<NaviButton
									icon="logout"
									onClick={() =>
										signOut({
											callbackUrl: '/auth/login',
										})
									}
									data-testid="logout-button-header"
								>
									Log out
								</NaviButton>
							</Navi>
						</nav>
					</div>
				</div>
			</header>
			{showSettingsModal && (
				<Modal title="Einstellungen" isVisible={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
					<UserSettings
						setSuccess={() => setShowSettingsModal(false)}
						onCancel={() => setShowSettingsModal(false)}
					/>
				</Modal>
			)}
		</>
	);
};
