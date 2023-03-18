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
} from '@smartive-education/pizza-hawaii';

import { TPost, TUser } from '../types';
import { TUploadImageFile } from '../services/api/posts/reply';
import { services } from '../services';
import { ImageUpload } from './ImageUpload';

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
	const [showModal, setShowModal] = useState(false);
	// TODO error handling if file too big
	const [file, setFile] = useState<TUploadImageFile | null>(null);
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
				return;
			}

			setFile(
				Object.assign(newFile, {
					preview: URL.createObjectURL(newFile),
				})
			);
		},
	});

	const { variant, placeHolderText, author, replyTo } = props;
	const setting = ContentInputCardVariantMap[variant] || ContentInputCardVariantMap.newPost;
	const [text, setText] = React.useState<string>('');
	const testimage = null;

	const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const showImageUploadModal = () => {
		setShowModal(true);
	};

	const onSubmitHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const replyToPostId = replyTo?.id || undefined;

		console.log('replyTO Post submitted!  id', replyTo?.id);
		console.log('submitted text', text);
		services.api.posts.reply({
			text: text,
			file: testimage,
			replyTo: replyToPostId,
		});
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

	//TODO; implement upload image function
	function onSubmitImage(e: React.FormEvent<HTMLFormElement>): void {
		throw new Error('Function not implemented.');
	}

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
			<FormTextarea
				label={placeHolderText}
				placeholder={placeHolderText}
				hideLabel={true}
				size="L"
				onChange={(e) => inputChangeHandler(e)}
			/>

			{showModal && (
				<Modal title="Bild Hochladen" isVisible={showModal} onClose={() => setShowModal(false)}>
					<form onSubmit={(e) => onSubmitImage(e)}>
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
											Datei hierhinziehen oder clicken
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
						<Button colorScheme="gradient" icon="eye">
							Dieses Bild posten
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
