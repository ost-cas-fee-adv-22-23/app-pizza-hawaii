import { Modal } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import React, { FC, SyntheticEvent, useEffect, useRef, useState } from 'react';

import ProjectSettings from '../data/ProjectSettings.json';
import { TPost } from '../types/Post';

type TImageModal = {
	post: TPost;
	onClose: () => void;
};

const ImageModal: FC<TImageModal> = ({ post, onClose }) => {
	const myImageRef = useRef(null);

	const [loading, setLoading] = useState(true);
	const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
	const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });

	// get actual screen dimensions on resize
	useEffect(() => {
		const handleResize = () => {
			setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
		const image = event?.target as HTMLImageElement;

		const maxWidth = Math.min(
			screenDimensions.width - 100,
			Math.max(image?.naturalWidth, ProjectSettings.images.post.width)
		);
		const maxHeight = Math.min(screenDimensions.height - 100, image?.naturalHeight);

		setImageDimensions({ width: maxWidth, height: maxHeight });
		setLoading(false);
	};

	// cover image
	return (
		<Modal isVisible={true} onClose={onClose}>
			<div className="content-center">
				{loading && <div className="animate-pulse h-64 w-full bg-gray-400 rounded-lg" />}
				<NextImage
					ref={myImageRef}
					src={post.mediaUrl as string}
					onLoad={handleImageLoad}
					width={imageDimensions.width}
					height={imageDimensions.height}
					sizes="(min-width: 640px) 50vw, 80vw"
					alt={`Image from user ${post.user.userName}`}
				/>
			</div>
		</Modal>
	);
};

export default ImageModal;
