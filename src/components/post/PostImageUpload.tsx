import { Icon, Label } from '@smartive-education/pizza-hawaii';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';

type TPostImageUpload = {
	onNewFile: (file: File) => void;
};

export const PostImageUpload: FC<TPostImageUpload> = ({ onNewFile }) => {
	const handleFileDrop = (acceptedFiles: File[]) => {
		const uploadedFile = acceptedFiles?.[0];
		onNewFile && onNewFile(uploadedFile);
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/png': [],
			'image/jpeg': [],
			'image/jpg': [],
			'image/gif': [],
		},
		maxSize: 5000000,
		onDrop: handleFileDrop,
		onDropRejected: (rejectedFiles, error) => {
			console.error('onDropRejected:', rejectedFiles, error);
		},
		onError: (error) => {
			console.error('onError:', error);
		},
	});
	// eslint-disable-next-line no-console
	console.log('next release will have a file upload');
	return (
		<div className="p-2 h-48 cursor-pointer flex justify-center align-middle bg-slate-100 text-slate-600">
			<div {...getRootProps({ className: 'dropzone' })}>
				<input {...getInputProps()} placeholder="Um Datei uploaden hierhinziehen oder clicken" />
				<div className="block justify-center text-center align-middle p-10">
					<Icon size="L" name="upload" />
					<br />
					<Label as="span" size="M">
						Datei hier hineinziehen oder clicken
					</Label>
					<br />
					<Label as="span" size="S">
						JPG, GIF oder PNG, maximal 5 MB
					</Label>
				</div>
			</div>
		</div>
	);
};
