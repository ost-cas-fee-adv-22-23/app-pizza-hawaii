/* eslint-disable react/forbid-component-props */
import React, { Dispatch, FC } from 'react';
import { Image, Modal, Label } from '@smartive-education/pizza-hawaii';
import { TPost } from '../types/Post';
import { TReducedPost } from './ProfileHeader';

type TFullscreen = {
	post: TPost | TReducedPost;
	toggleHandler: Dispatch<boolean>;
};

const Fullscreen: FC<TFullscreen> = (props: TFullscreen) => {
	const { post, toggleHandler } = props;
	console.log(post);
	const close = () => {
		toggleHandler(false);
	};

	return (
		<Modal title={`Posted by: ${post.user.displayName}`} isVisible={true} onClose={() => close()}>
			<div className="w-max-10/12 h-auto content-center mx-content ">
				<Image src={post.mediaUrl} alt={`Mumble-Post by Mumbel User ${post.user.userName}`} />
				<br />
				<Label as="legend" size="M">
					{post?.user.displayName}: {post?.text}
				</Label>
			</div>
		</Modal>
	);
};

export default Fullscreen;
