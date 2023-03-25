import React, { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
	Button,
	Label,
	Grid,
	FormTextarea,
	UserName,
	UserContentCard,
	TUserContentCard,
	Modal,
	Icon,
	Image,
} from '@smartive-education/pizza-hawaii';

import { TPost, TUser } from '../types';
import { ImageUpload } from './ImageUpload';

export type TAddPostProps = {
	text: string;
	file?: File;
	replyTo?: string;
};

type TContentInput = {
	variant: 'newPost' | 'answerPost';
	headline: string;
	author: TUser;
	placeHolderText: string;
	replyTo?: TPost;
	onAddPost: (data: TAddPostProps) => void;
};

type TContentCardvariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
};

const ContentInputCardVariantMap: Record<TContentInput['variant'], TContentCardvariantMap> = {
	newPost: {
		headlineSize: 'XL',
		textSize: 'L',
		avatarSize: 'M',
		avatarVariant: 'standalone',
	},
	answerPost: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
	},
};

export const ContentInput: FC<TContentInput> = (props) => {
	const { variant, placeHolderText, author, replyTo, onAddPost } = props;
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState<File>();
	const [filePreview, setFilePreview] = useState<string>('');
	const [text, setText] = React.useState<string>('');
	const setting = ContentInputCardVariantMap[variant] || ContentInputCardVariantMap.newPost;
	// Dropzone hook
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/png': [],
			'image/jpeg': [],
			'image/jpg': [],
			'image/gif': [],
		},
		maxSize: 5000000,
		onDrop: (acceptedFiles) => {
			const newFile = acceptedFiles[0];

			if (!newFile) {
				return null;
			}

			setFile(newFile);
			setFilePreview(URL.createObjectURL(newFile));
		},
		onDropRejected: (rejectedFiles, error) => {
			console.error('onDropRejected: rejectedFiles', rejectedFiles, error);
			// TODO: Sedning error message to the user in modal
			console.log(rejectedFiles[0].errors[0].message);
		},

		onError: (error) => {
			if (error) {
				console.error('onError: error', error);
			}
		},
	});

	const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const showImageUploadModal = () => {
		setShowModal(true);
	};

	const onChooseImage = () => {
		setShowModal(false);
	};

	const closeModal = () => {
		setShowModal(false);
		setFile(undefined);
	};

	const onSubmitPostHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		try {
			onAddPost &&
				onAddPost({
					text,
					file,
					replyTo: replyTo?.id,
				});

			setFile(undefined); // reset file path
			setText(''); // TODO: reset text only if post was successful
		} catch (error) {
			console.error('onSubmitPostHandler: error', error);
		}
	};

	const headerSlotContent = props.headline ? (
		props.headline
	) : (
		<Grid variant="col" gap="S">
			<Grid variant="col" gap="S">
				<Label as="span" size={setting.headlineSize}>
					{`${author.displayName}`}
				</Label>
				<Grid variant="row" gap="S">
					<UserName href={author.profileLink as string}>{author.userName}</UserName>
				</Grid>
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: author.avatarUrl,
				userName: author.userName,
				href: author.profileLink,
			}}
			avatarVariant={setting.avatarVariant}
			avatarSize={setting.avatarSize}
		>
			{!showModal && file && (
				<Image src={filePreview} width={600} caption="Vorschau: Möchtest Du dieses Bild posten?" alt="preview" />
			)}
			<FormTextarea
				label={placeHolderText}
				placeholder={placeHolderText}
				hideLabel={true}
				size="L"
				value={text}
				onChange={(e) => inputChangeHandler(e)}
			/>

			{showModal && (
				<Modal title="Bild Hochladen" isVisible={showModal} onClose={() => closeModal()}>
					<form onSubmit={() => onChooseImage()}>
						{file ? (
							<ImageUpload src={filePreview as string} />
						) : (
							<div className="p-2 h-48 cursor-pointer flex justify-center align-middle bg-slate-100">
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
						)}
						<Button colorScheme="gradient" icon="eye">
							Dieses Bild wählen
						</Button>
					</form>
				</Modal>
			)}
			<Grid variant="row" gap="S" wrapBelowScreen="md">
				<Button colorScheme="slate" icon="upload" onClick={showImageUploadModal}>
					Bild Hochladen
				</Button>
				<Button colorScheme="violet" icon="send" onClick={onSubmitPostHandler}>
					Absenden
				</Button>
			</Grid>
		</UserContentCard>
	);
};
