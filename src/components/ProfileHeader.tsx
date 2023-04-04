import React, { FC, useState } from 'react';

import { Image, ImageOverlay } from '@smartive-education/pizza-hawaii';
import { UserProfile } from './UserProfile';
import { TUser } from '../types';
import ProjectSettings from '../data/ProjectSettings.json';
import ImageModal from './ImageModal';
import UserSettings from './UserSettings';

/**
 * @description
 * This page shows Profile Header of any user and the curent user Profile Header with some additional features.
 * As quacker API is not providing a posterImage for users we are using a placeholder image. It looks much better with a real image.
 * if the current user is clicking on his posterImage he can change it in the modal UserSettings if we implement that feature within the API v2.0.
 */

/*
 * Type
 */

type TProfileHeader = {
	user: TUser;
	canEdit: boolean;
};

export type TReducedPost = {
	mediaUrl?: string;
	text: string;
	user: {
		displayName: string;
		userName: string;
	};
};

export const ProfileHeader: FC<TProfileHeader> = ({ user, canEdit = false }) => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showFullscreen, setShowFullscreen] = useState(false);

	const toggleSettingsModal = () => (): void => {
		setShowSettingsModal(!showSettingsModal);
	};

	const toggleFullscreen = () => (): void => {
		setShowFullscreen(!showFullscreen);
	};

	// for fullscreen component to work TReducedPost is enough information.
	const post: TReducedPost = {
		mediaUrl: user.posterImage,
		text: `PosterImage from ${user.displayName}`,
		user: { displayName: user.displayName, userName: user.userName },
	};

	return (
		<div className="relative mb-6">
			{canEdit ? (
				<ImageOverlay
					preset="edit"
					buttonLabel={'Hintergrundbild anpassen'}
					onClick={toggleSettingsModal()}
					borderRadius="L"
				>
					<Image
						src={user.posterImage}
						alt={user.userName}
						width={ProjectSettings.images.header.width}
						height={
							(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
							ProjectSettings.images.header.aspectRatio[1]
						}
					/>
				</ImageOverlay>
			) : (
				<ImageOverlay
					preset="enlarge"
					buttonLabel={'Hintergrundbild anzeigen'}
					onClick={toggleFullscreen()}
					borderRadius="L"
				>
					<Image
						src={user.posterImage}
						alt={user.userName}
						width={ProjectSettings.images.header.width}
						height={
							(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
							ProjectSettings.images.header.aspectRatio[1]
						}
					/>
				</ImageOverlay>
			)}
			<div className="absolute right-8 bottom-0 translate-y-1/2 z-10">
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
			{showFullscreen && <ImageModal post={post} toggleHandler={setShowFullscreen} />}
			{showSettingsModal && <UserSettings user={user} toggleSettingsModal={setShowSettingsModal} />}
		</div>
	);
};
