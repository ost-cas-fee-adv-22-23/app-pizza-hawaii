import React, { FC } from 'react';

import { Image, UserProfile, ImageOverlay } from '@smartive-education/pizza-hawaii';

import { TUser } from '../types';
import ProjectSettings from '../data/ProjectSettings.json';

/*
 * Type
 */

type TProfileHeader = {
	user: TUser;
	canEdit: boolean;
};

export const ProfileHeader: FC<TProfileHeader> = ({ user, canEdit = false }) => {
	return (
		<div className="relative mb-6">
			{canEdit ? (
				<ImageOverlay
					preset="edit"
					buttonLabel={'Hintergrundbild anpassen'}
					onClick={function (): void {
						throw new Error('Function not implemented.');
					}}
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
					onClick={function (): void {
						throw new Error('Function not implemented.');
					}}
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
					href={canEdit ? '/profile' : user.profileLink}
					buttonLabel={canEdit ? 'Change Avatar' : 'View Avatar'}
				/>
			</div>
		</div>
	);
};
