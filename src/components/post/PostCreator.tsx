import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useDropzone } from 'react-dropzone';

import {
	Button,
	Label,
	Grid,
	FormTextarea,
	IconText,
	UserContentCard,
	TUserContentCard,
	Modal,
	Icon,
	Image,
} from '@smartive-education/pizza-hawaii';
import { ImageUpload } from '../ImageUpload';

import { TPost, TUser } from '../../types';

export type TAddPostProps = {
	text: string;
	file?: File;
	replyTo?: string;
};

type TPostCreator = {
	variant: 'newPost' | 'answerPost';
	headline: string;
	placeHolderText: string;
	replyTo?: TPost;
	textAreaId?: string;
	onAddPost: (data: TAddPostProps) => Promise<TPost | null>;
};

type TContentCardvariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
};

const PostCreatorCardVariantMap: Record<TPostCreator['variant'], TContentCardvariantMap> = {
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

export const PostCreator: FC<TPostCreator> = (props) => {
	const { variant, placeHolderText, replyTo, textAreaId, onAddPost } = props;

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const [showModal, setShowModal] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [file, setFile] = useState<File>();
	const [filePreview, setFilePreview] = useState<string>('');
	const [text, setText] = React.useState<string>('');
	const setting = PostCreatorCardVariantMap[variant] || PostCreatorCardVariantMap.newPost;

	useEffect(() => {
		if (text?.length > 0 || file) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [text, file]);

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

	const onSubmitPostHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if ((!text && !file) || !onAddPost) {
			return;
		}

		const newPost = await onAddPost({
			text,
			file,
			replyTo: replyTo?.id,
		});

		if (!newPost) {
			// TODO: Sending error message to the user in modal?
			return;
		}

		// Reset input field and file
		setText('');
		setFile(undefined);
	};

	const headerSlotContent = props.headline ? (
		props.headline
	) : (
		<Grid variant="col" gap="S">
			<Grid variant="col" gap="S">
				<Label as="span" size={setting.headlineSize}>
					{currentUser?.displayName}
				</Label>
				<Grid variant="row" gap="S">
					<NextLink href={currentUser?.profileLink}>
						<IconText icon="profile" colorScheme="violet" size="S">
							{currentUser?.userName}
						</IconText>
					</NextLink>
				</Grid>
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: currentUser?.avatarUrl,
				userName: currentUser?.userName,
				href: currentUser?.profileLink,
			}}
			avatarVariant={setting.avatarVariant}
			avatarSize={setting.avatarSize}
		>
			{!showModal && file && (
				<Image src={filePreview} width={600} caption="Vorschau: Möchtest Du dieses Bild posten?" alt="preview" />
			)}
			<FormTextarea
				id={textAreaId}
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
				{/* TODO: disabled state to component lib */}
				<div className={isValid ? 'w-full' : 'w-full opacity-50'}>
					<Button colorScheme="violet" icon="send" onClick={onSubmitPostHandler} disabled={!isValid}>
						Absenden
					</Button>
				</div>
			</Grid>
		</UserContentCard>
	);
};
