import React, { FC, ImgHTMLAttributes } from 'react';
import { Image, Label } from '@smartive-education/pizza-hawaii';

type TImageUpload = {
	// imageComponent?: ImgHTMLAttributes;
	src: string;
	width: number;
	height: number;
	style?: React.CSSProperties;
};

export const ImageUpload: FC<TImageUpload> = ({ ...props }) => {
	const { src, width, height } = props;
	return (
		<div className="p-5 ">
			<Image src={src} alt="fada" width={width} height={height} caption={src} />
			<Label as="legend" size="M">
				Das Bild sollte im Format JPG sein und nicht grösser als 5MB sein.
			</Label>
		</div>
	);
};
