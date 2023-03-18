import React, { FC } from 'react';
import { Image, Label } from '@smartive-education/pizza-hawaii';

type TImageUpload = {
	Image?: HTMLImageElement | null;
	src: string;
	width?: number;
	height?: number;
	alt?: string;
	style?: React.CSSProperties;
};

export const ImageUpload: FC<TImageUpload> = ({ ...props }) => {
	const { src, width = 640, height = 300, alt = 'src' } = props;
	return (
		<div className="p-5 ">
			<Image src={src} alt={alt} width={width} height={height} caption={src} />
			<Label as="legend" size="M">
				sollen wir den Alt-Text auch als input field ermöglichen?
			</Label>
		</div>
	);
};
