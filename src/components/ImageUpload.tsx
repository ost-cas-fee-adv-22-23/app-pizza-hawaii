import { Image, Label } from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import React, { FC } from 'react';

type TImageUpload = {
	Image?: HTMLImageElement | null;
	src: string;
	width?: number;
	height?: number;
	alt?: string;
	style?: React.CSSProperties;
};

export const ImageUpload: FC<TImageUpload> = ({ ...props }) => {
	const { src, width = 640, height = 320, alt = 'src' } = props;
	return (
		<div className="p-5 ">
			<Image src={src} alt={alt} width={width} height={height} imageComponent={NextImage} />
			<br />
			<Label as="p" size="L">
				Cooles Bild! Schreib doch noch ein Text dazu...
			</Label>
		</div>
	);
};
