import { Link, Navi, NaviButton } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { signOut } from 'next-auth/react';
import { FC, useState } from 'react';

import MumbleLogo from '../assets/svg/mumbleLogo.svg';
import { TUser } from '../types';
import { UserProfile } from './user/UserProfile';
import UserSettings from './UserSettings';

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
									/>
								</NaviButton>
								<NaviButton icon="settings" onClick={handleSettingsClick}>
									Settings
								</NaviButton>
								<NaviButton icon="logout" onClick={() => signOut()}>
									Log out
								</NaviButton>
							</Navi>
						</nav>
					</div>
				</div>
			</header>
			{showSettingsModal && <UserSettings user={user} toggleSettingsModal={setShowSettingsModal} />}
		</>
	);
};
