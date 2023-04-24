import {
	Button,
	FormTextarea,
	Grid,
	IconText,
	Image,
	Label,
	Modal,
	RoundButton,
	TUserContentCard,
	UserContentCard,
} from '@smartive-education/pizza-hawaii';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';

import { TPost, TUser } from '../../types';
import { PostImageUpload } from './PostImageUpload';

export type TAddPostProps = {
	text: string;
	image?: File;
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

	// We allow only a text or a file or both. Only file is not valid. harsch MumblePolicy :)
	useEffect(() => {
		if (text?.length > 0 || file) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [text, file]);

	const updateFile = (file?: File) => {
		if (file) {
			setShowModal(false);
			setFilePreview(URL.createObjectURL(file));
		} else {
			setFilePreview('');
		}

		setFile(file);
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const onSubmitPostHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		// return if no text or file is set or no onAddPost function is passed
		if ((!text && !file) || !onAddPost) {
			return;
		}

		const newPost = await onAddPost({
			text: text || ' ',
			image: file,
			replyTo: replyTo?.id,
		});

		if (!newPost) {
			return;
		}

		// Reset input field and file
		setText('');
		updateFile();
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
				<div className="relative">
					<Image src={filePreview} width={600} alt="" />
					<div className="absolute top-0 right-0 translate-x-2/4 -translate-y-2/4">
						<RoundButton
							colorScheme="slate"
							icon="cancel"
							onClick={() => updateFile()}
							buttonLabel="Bild verwerfen"
							title="Bild verwerfen"
						/>
					</div>
				</div>
			)}

			<FormTextarea
				id={textAreaId}
				label={placeHolderText}
				placeholder={placeHolderText}
				hideLabel={true}
				size="L"
				value={text}
				onChange={inputChangeHandler}
			/>

			{showModal && (
				<Modal title="Bild Hochladen" isVisible={showModal} onClose={() => setShowModal(false)}>
					<PostImageUpload onNewFile={(file) => updateFile(file)} />
				</Modal>
			)}
			<Grid variant="row" gap="S" wrapBelowScreen="md">
				<Button colorScheme="slate" icon="upload" onClick={() => setShowModal(true)}>
					Bild auswählen
				</Button>
				<Button colorScheme="violet" icon="send" onClick={onSubmitPostHandler} disabled={!isValid}>
					Absenden
				</Button>
			</Grid>
		</UserContentCard>
	);
};
