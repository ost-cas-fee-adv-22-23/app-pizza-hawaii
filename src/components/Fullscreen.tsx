import React, { Dispatch, FC } from 'react';
import { Image, Modal, Label } from '@smartive-education/pizza-hawaii';
import { TPost } from '../types/Post';

type TFullscreen = {
	post: TPost;
	toggleHandler: Dispatch<boolean>;
};

const Fullscreen: FC<TFullscreen> = (props: TFullscreen) => {
	const { post, toggleHandler } = props;

	const close = () => {
		toggleHandler(false);
	};
	//TODO: width with vw and vh

	return (
		<Modal title={`Posted by: ${post.user.displayName}`} isVisible={true} onClose={() => close()}>
			<Image width={1000} src={post.mediaUrl} alt="hi there" />
			<br />
			<Label as="legend" size="M">
				{post.user.displayName}: {post.text}
			</Label>
		</Modal>
	);
};

export default Fullscreen;
