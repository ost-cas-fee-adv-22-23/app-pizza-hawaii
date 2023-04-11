import { Image, Label, Modal } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import React, { Dispatch, FC } from 'react';

import { TPost } from '../types/Post';
import { TReducedPost } from './ProfileHeader';

type TImageModal = {
	post: TPost | TReducedPost;
	toggleHandler: Dispatch<boolean>;
};

const ImageModal: FC<TImageModal> = (props: TImageModal) => {
	const { post, toggleHandler } = props;

	const close = () => {
		toggleHandler(false);
	};

	return (
		<Modal isVisible={true} onClose={() => close()}>
			<div className="w-full h-full content-center ">
				<Image
					src={post.mediaUrl}
					width={0}
					height={0}
					sizes="100vw"
					style={{ width: '100%', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}
					alt={`Mumble-Post by Mumbel User ${post.user.userName}`}
					imageComponent={NextImage}
				/>
			</div>
		</Modal>
	);
};

export default ImageModal;
