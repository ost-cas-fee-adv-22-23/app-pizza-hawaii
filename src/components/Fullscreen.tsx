import React, { FC } from 'react';
import { Image, Modal, Label } from '@smartive-education/pizza-hawaii';
import { TPost } from '../types/Post';

type TFullscreen = {
	post: TPost;
	isVisible: boolean;
};

const Fullscreen: FC<TFullscreen> = (props: TFullscreen) => {
	const { post, isVisible } = props;

	console.log('Fullscreen post', post, isVisible);
	// const [showFullscreen, setShowFullscreen] = useState(false);
	// TODO: close modal

	return (
		<Modal title="The Big Fullscreen" isVisible={isVisible} onClose={() => close()}>
			<Image width={1000} src={post.mediaUrl} alt='hi there' />
			<Label as="legend" size="M">{post.text} </Label>
		</Modal>
	);
};

export default Fullscreen;
