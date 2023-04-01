import React, { useState, FormEvent, FC, Dispatch } from 'react';
import { Modal, Form, Grid, FormInput, FormTextarea, FormPassword, Button, Label } from '@smartive-education/pizza-hawaii';

import { TUser } from '../types';

type TUserSettings = {
	user: TUser;
	toggleSettingsModal: Dispatch<boolean>;
};

const UserSettings: FC<TUserSettings> = ({ user, toggleSettingsModal }) => {
	const [state, setState] = useState({
		user: user,
	});

	const close = (): void => {
		toggleSettingsModal(false);
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
		<Modal title="Einstellungen" isVisible={true} onClose={() => close()}>
			<Form>
				<fieldset>
					<Label as="legend" size="XL">
						USERSETTINGS: Persönliche Einstellungen
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
					<Button colorScheme="slate" icon="cancel">
						Abbrechen
					</Button>
					<Button colorScheme="violet" icon="checkmark">
						Speichern
					</Button>
				</Grid>
			</Form>
		</Modal>
	);
};

export default UserSettings;
