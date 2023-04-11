import { Image, Label, Modal } from '@smartive-education/pizza-hawaii';
import React, { FC } from 'react';

import { TPost } from '../types/Post';
import { TReducedPost } from './ProfileHeader';

type TImageModal = {
	post: TPost | TReducedPost;
	onClose: () => void;
};

const ImageModal: FC<TImageModal> = (props: TImageModal) => {
	const { onClose, post } = props;

	return (
		<Modal title={`Posted by: ${post.user.displayName}`} isVisible={true} onClose={onClose}>
			<div className="w-max-10/12 h-auto content-center mx-content">
				<Image src={post.mediaUrl} alt={`Mumble-Post by Mumbel User ${post.user.userName}`} />
				<br />
				<Label as="legend" size="M">
					{post?.user.displayName}: {post?.text}
				</Label>
			</div>
		</Modal>
	);
};

export default ImageModal;
