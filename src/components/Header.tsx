import { FC, useState } from 'react';
import { signOut } from 'next-auth/react';
import NextLink from 'next/link';
import Image from 'next/image';

import { Navi, Link, NaviButton } from '@smartive-education/pizza-hawaii';

import { UserProfile } from './user/UserProfile';
import { TUser } from '../types';

import MumbleLogo from '../assets/svg/mumbleLogo.svg';
import UserSettings from './form/UserSettings';

type THeader = {
	user: TUser;
};

export const Header: FC<THeader> = ({ user }) => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);

	const handleSettingsClick = (): void => {
		setShowSettingsModal(true);
	};

	return (
		<>
			<header className="Header mb-8 bg-violet-600 text-white">
				<div className="px-content py-3">
					<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
						<div className="flex w-[209px]">
							<Link href="/" component={NextLink}>
								<Image src={MumbleLogo} alt="Mumble Messenger" priority={true} />
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
									/>
								</NaviButton>
								<NaviButton icon="settings" onClick={handleSettingsClick}>
									Settings
								</NaviButton>
								<NaviButton
									icon="logout"
									onClick={() =>
										signOut({
											callbackUrl: '/auth/login',
										})
									}
								>
									Log out
								</NaviButton>
							</Navi>
						</nav>
					</div>
				</div>
			</header>
			{showSettingsModal && <UserSettings user={user} onClose={() => setShowSettingsModal(false)} />}
		</>
	);
};
