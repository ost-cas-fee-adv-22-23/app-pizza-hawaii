import { Image, ImageOverlay, Modal } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import React, { FC, useState } from 'react';

import ProjectSettings from '../data/ProjectSettings.json';
import { TUser } from '../types';
import { TPost } from '../types/Post';
import UserSettings from './form/UserSettings';
import ImageModal from './ImageModal';
import { UserProfile } from './user/UserProfile';
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

export const ProfileHeader: FC<TProfileHeader> = ({ user, canEdit = false }) => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);

	/*
	 * for ImageModal component to work a reducedPost would be enough information.
	 * But we need a full post object to pass the user information in the modal that dependancy cruiser is happy
	 * as he does not accept two different types from two components even the typescript compiler is happy with it.
	 * We dont have this full information of a Post within the Profile header component. And it makes no sense to pass it down.
	 * So we create a reduced post object from the full post object to comply with the ImageModal component.
	 * Maybe we refactor as only the mediaUrl is actually needed.
	 */

	const reducedPost: TPost = {
		mediaUrl: user.posterImage,
		mediaType: 'image',
		text: `PosterImage from ${user.displayName}`,
		id: '0000000',
		creator: '',
		type: 'post',
		createdAt: '',
		likeCount: 0,
		likedByUser: false,
		user: {
			displayName: user.displayName,
			userName: user.userName,
			firstName: '',
			lastName: '',
			avatarUrl: '',
			profileLink: '',
			id: '',
			createdAt: '',
		},
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
						src={user.posterImage}
						alt={user.userName}
						width={ProjectSettings.images.header.width}
						height={
							(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
							ProjectSettings.images.header.aspectRatio[1]
						}
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
						src={user.posterImage}
						alt={user.userName}
						width={ProjectSettings.images.header.width}
						height={
							(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
							ProjectSettings.images.header.aspectRatio[1]
						}
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
			{showImageModal && <ImageModal post={post} onClose={() => setShowImageModal(false)} />}
			{showSettingsModal && (
				<Modal title="Einstellungen" isVisible={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
					<UserSettings setSuccess={() => setShowSettingsModal(false)} />
				</Modal>
			)}
		</div>
	);
};
