import { Image, ImageOverlay, Modal } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import React, { FC, useState } from 'react';

import ProjectSettings from '../data/ProjectSettings.json';
import { TUser } from '../types';
import UserSettings from './form/UserSettings';
import ImageModal, { TImageModalPicture } from './ImageModal';
import { UserProfile } from './user/UserProfile';
/**
 * @description
 * This page shows Profile Header of any user and the curent user Profile Header with some additional features.
 * As quacker API is not providing a posterImage for users (by now!) we are using a placeholder image.
 * It looks much better with a real image and inteded by the designer.
 * if the current user (yourself) is clicking on his posterImage he can change it in the modal UserSettings if we implement that feature within the API v2.0.
 * for now the setting modal opens.
 **/

/*
 * Type
 */

type TProfileHeader = {
	user: TUser;
	canEdit: boolean;
};

export const ProfileHeader: FC<TProfileHeader> = ({ user, canEdit = false }) => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);

	const picture: TImageModalPicture = {
		src: user.posterImage,
		width: ProjectSettings.images.header.width,
		height:
			(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
			ProjectSettings.images.header.aspectRatio[1],
		alt: `Posterbackground of ${user.displayName}`,
	};

	return (
		<div className="relative mb-6 sm:-mx-4 sm:-mt-2">
			{canEdit ? (
				<ImageOverlay
					preset="edit"
					buttonLabel={'Hintergrundbild anpassen'}
					onClick={() => setShowSettingsModal(true)}
					borderRadius="L"
				>
					<Image
						src={picture.src}
						alt={picture.alt}
						width={picture.width}
						height={picture.height}
						imageComponent={NextImage}
					/>
				</ImageOverlay>
			) : (
				<ImageOverlay
					preset="enlarge"
					buttonLabel={'Hintergrundbild anzeigen'}
					onClick={() => setShowImageModal(true)}
					borderRadius="L"
				>
					<Image
						src={picture.src}
						alt={picture.alt}
						width={picture.width}
						height={picture.height}
						imageComponent={NextImage}
					/>
				</ImageOverlay>
			)}
			<div className="absolute right-8 bottom-0 translate-y-1/2 z-10 sm:right-1/2 sm:translate-x-1/2">
				<UserProfile
					userName={user.userName}
					avatar={user.avatarUrl}
					size="XL"
					border={true}
					canEdit={canEdit}
					href={user.profileLink}
					buttonLabel={canEdit ? 'Change Avatar' : ''}
				/>
			</div>
			{showImageModal && <ImageModal picture={picture} onClose={() => setShowImageModal(false)} />}
			{showSettingsModal && (
				<Modal title="Einstellungen" isVisible={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
					<UserSettings
						setSuccess={() => setShowSettingsModal(false)}
						onCancel={() => setShowSettingsModal(false)}
					/>
				</Modal>
			)}
		</div>
	);
};
