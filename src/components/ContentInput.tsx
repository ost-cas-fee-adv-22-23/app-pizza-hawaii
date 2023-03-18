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
import { TUploadImageFile } from '../services/api/posts/reply';
import { services } from '../services';
import { ImageUpload } from './ImageUpload';
import { useSession } from 'next-auth/react';

type TContentInput = {
	variant: 'newPost' | 'answerPost';
	headline: string;
	author: TUser;
	placeHolderText: string;
	replyTo?: TPost;
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
	const { data: session } = useSession();
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState<TUploadImageFile | null>(null);
	const [text, setText] = React.useState<string>('');

	// const [imageToUpload, setImageToUpload] = useState<string | null>(null);
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
			console.log('new file', newFile);
			if (!newFile) {
				return null;
			}
			// TODO error handling if file too big

			setFile(
				Object.assign(newFile, {
					preview: URL.createObjectURL(newFile),
				})
			);
		},
	});

	const { variant, placeHolderText, author, replyTo } = props;
	// variant settings: reply or new post
	const setting = ContentInputCardVariantMap[variant] || ContentInputCardVariantMap.newPost;
	const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const showImageUploadModal = () => {
		setShowModal(true);
	};

	const onChooseImage = (file: TUploadImageFile): void => {
		// setImageToUpload(file?.preview || null);
		setShowModal(false);
	};

	const onSubmitHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const replyToPostId = replyTo?.id || undefined;
		const imageToUpload = file?.preview || null;
		// const accessToken = session?.accessToken || undefined;
		console.log('submitted accessToken', session?.accessToken);
		console.log('submitted text', text);
		console.log('submitted image', imageToUpload);
		try {
			services.api.posts.reply({
				text: text,
				file: imageToUpload,
				replyTo: replyToPostId,
				accessToken: session?.accessToken,
			});

			setFile(null); // reset file
		} catch (error) {
			console.error('onSubmitHandler: error', error);
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
				<Image src={file.preview} width={600} caption="Vorschau: Möchtest Du dieses Bild posten?" alt="preview" />
			)}
			<FormTextarea
				label={placeHolderText}
				placeholder={placeHolderText}
				hideLabel={true}
				size="L"
				onChange={(e) => inputChangeHandler(e)}
			/>

			{showModal && (
				<Modal title="Bild Hochladen" isVisible={showModal} onClose={() => setShowModal(false)}>
					<form onSubmit={() => onChooseImage(file)}>
						{file ? (
							<ImageUpload src={file.preview} />
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
						<input type={text} />
						<br />
						<Button as="button" colorScheme="gradient" icon="eye">
							Dieses Bild wählen
						</Button>
					</form>
				</Modal>
			)}
			<Grid variant="row" gap="S" wrapBelowScreen="md">
				<Button as="button" colorScheme="slate" icon="upload" onClick={() => showImageUploadModal()}>
					Bild Hochladen
				</Button>
				<Button as="button" colorScheme="violet" icon="send" onClick={(e) => onSubmitHandler(e)}>
					Absenden
				</Button>
			</Grid>
		</UserContentCard>
	);
};
