import { FC, useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import NextLink from 'next/link';
import Image from 'next/image';

import {
	Navi,
	Link,
	UserProfile,
	Modal,
	Form,
	Button,
	Label,
	Grid,
	FormInput,
	FormTextarea,
	FormPassword,
} from '@smartive-education/pizza-hawaii';

import { NaviButton } from './NaviButton';

import { TUser } from '../types';

import MumbleLogo from '../assets/svg/mumbleLogo.svg';

type THeader = {
	user: TUser;
	profileLink?: string;
};

export const Header: FC<THeader> = ({ user }) => {
	const [state, setState] = useState({
		showSettingsModal: false,
		user: user,
	});

	const handleSettingsModalClick = (): void => {
		setState({ ...state, showSettingsModal: !state.showSettingsModal });
	};

	const onFieldChange = (e: FormEvent): void => {
		const { name, value } = e.target as HTMLInputElement;

		setState({
			...state,
			user: {
				...state.user,
				[name]: value,
			},
		});
	};

	return (
		<>
			<header className="Header mb-8 bg-violet-600 text-white">
				<div className="px-content py-3">
					<div className="flex items-center justify-between gap-8 w-full max-w-content mx-auto">
						<div className="flex w-[209px]">
							<Link href="/" component={NextLink}>
								<Image src={MumbleLogo} alt="Mumble Messenger" />
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
									/>
								</NaviButton>
								<NaviButton icon="settings" onClick={handleSettingsModalClick}>
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
			{state.showSettingsModal && (
				<Modal title="Einstellungen" isVisible={state.showSettingsModal} onClose={handleSettingsModalClick}>
					<Form>
						<fieldset>
							<Label as="legend" size="XL">
								Persönliche Einstellungen
							</Label>
							<div className="mt-4">
								<Grid variant="col" gap="M" marginBelow="M">
									<FormInput
										type="text"
										label="UserName"
										name="userName"
										value={state.user.userName}
										disabled={true}
										icon="mumble"
										onChange={onFieldChange}
									/>
									<FormInput
										type="text"
										label="Vorname"
										name="firstName"
										value={state.user.firstName}
										onChange={onFieldChange}
									/>
									<FormInput
										type="text"
										label="Name"
										name="lastName"
										value={state.user.lastName}
										onChange={onFieldChange}
									/>
									<FormInput
										type="email"
										label="E-Mail"
										name="email"
										value={state.user.email}
										onChange={onFieldChange}
									/>
									<FormTextarea label="Bio" name="bio" value={state.user.bio} onChange={onFieldChange} />
								</Grid>
							</div>
						</fieldset>
						<fieldset>
							<Label as="legend" size="XL">
								Passwort ändern
							</Label>
							<div className="mt-4">
								<Grid variant="col" gap="M" marginBelow="M">
									<FormPassword label="Altes Passwort" onChange={onFieldChange} />
									<FormPassword label="Neues Passwort" onChange={onFieldChange} />
								</Grid>
							</div>
						</fieldset>

						<Grid variant="row" gap="S" wrapBelowScreen="md">
							<Button colorScheme="slate" icon="cross">
								Abbrechen
							</Button>
							<Button colorScheme="violet" icon="check">
								Speichern
							</Button>
						</Grid>
					</Form>
				</Modal>
			)}
		</>
	);
};
