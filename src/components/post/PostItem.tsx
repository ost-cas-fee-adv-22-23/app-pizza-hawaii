import {
	CopyToClipboardButton,
	Grid,
	IconText,
	Image,
	ImageOverlay,
	InteractionButton,
	Label,
	Richtext,
	TimeStamp,
	TUserContentCard,
	UserContentCard,
} from '@smartive-education/pizza-hawaii';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useReducer, useState } from 'react';

import ProjectSettings from '../../data/ProjectSettings.json';
import PDReducer, { ActionType as PDActionType, initialState as initialPDState } from '../../reducer/postDetailReducer';
import { postsService } from '../../services/api/posts/';
import { TPost, TUser } from '../../types';
import ImageModal, { TModalPicture } from '../ImageModal';
import shortenString from '../../data/helpers/shortenString';

/*
 * Type
 */
export type TPostItemProps = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	onDeletePost?: (id: string) => void;
	onAnswerPost?: (id: string) => void;
};

type TPostItemVariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
	copyLink: boolean;
};

/*
 * Style
 */

const postItemVariantMap: Record<TPostItemProps['variant'], TPostItemVariantMap> = {
	detailpage: {
		headlineSize: 'XL',
		textSize: 'L',
		avatarSize: 'M',
		avatarVariant: 'standalone',
		copyLink: true,
	},
	timeline: {
		headlineSize: 'L',
		textSize: 'M',
		avatarSize: 'M',
		avatarVariant: 'standalone',
		copyLink: true,
	},
	response: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
		copyLink: false,
	},
};

export const PostItem: FC<TPostItemProps> = ({ variant, post: initialPost, onDeletePost, onAnswerPost }) => {
	const [post, postDispatch] = useReducer(PDReducer, {
		...initialPDState,
		...initialPost,
	});

	const [showImageModal, setShowImageModal] = useState(false);
	const [hydrationDone, setHydrationDone] = useState(false);

	useEffect(() => {
		setHydrationDone(true);
	}, []);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const setting = postItemVariantMap[variant] || postItemVariantMap.detailpage;

	const picture: TModalPicture = {
		src: post.mediaUrl,
		width: ProjectSettings.images.post.width,
		height:
			(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
			ProjectSettings.images.header.aspectRatio[1],
		alt: `Image of ${post.user.displayName}`,
	};

	// like and unlike function
	const handleLike = async () => {
		let response;
		if (post.likedByUser) {
			response = await postsService.unlike({ id: post?.id });
		} else {
			response = await postsService.like({ id: post?.id });
		}
		if (response) {
			postDispatch({ type: PDActionType.LIKE_TOGGLE });
		}
	};

	// handle answer function
	const handleAnswerPost = () => {
		onAnswerPost && onAnswerPost(post?.id);
	};
	// delete function
	const handleDeletePost = async () => {
		onDeletePost && onDeletePost(post?.id);
	};

	const headerSlotContent = (
		<Grid variant="col" gap="S">
			<Label as="span" size={setting.headlineSize}>
				{shortenString(post?.user.displayName, 30)}
			</Label>
			<Grid variant="row" gap="S">
				<NextLink href={post?.user.profileLink}>
					<IconText icon="profile" colorScheme="violet" size="S">
						{shortenString(post?.user.userName, 20)}
					</IconText>
				</NextLink>
				{post.createdAt && new Date(post.createdAt) && (
					<IconText icon="calendar" colorScheme="slate" size="S">
						{hydrationDone && <TimeStamp date={post?.createdAt} />}
					</IconText>
				)}
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: post?.user.avatarUrl,
				userName: post?.user.userName,
				href: post?.user.profileLink,
			}}
			avatarVariant={setting.avatarVariant}
			avatarSize={setting.avatarSize}
		>
			<Richtext size={setting.textSize}>{post.text}</Richtext>

			{post.mediaUrl && (
				<ImageOverlay preset="enlarge" buttonLabel="Enlarge image in modal" onClick={() => setShowImageModal(true)}>
					<Image
						width={picture.width}
						height={picture.height}
						src={picture.src}
						alt={picture.alt}
						imageComponent={NextImage}
					/>
				</ImageOverlay>
			)}
			{currentUser && (
				<Grid variant="row" gap="M" wrapBelowScreen="md">
					{variant === 'response' ? (
						<>
							{onAnswerPost && (
								<InteractionButton
									type="button"
									colorScheme="violet"
									buttonText={'Answer'}
									iconName={'repost'}
									onClick={handleAnswerPost}
								/>
							)}
						</>
					) : (
						<InteractionButton
							component={NextLink}
							href={`/mumble/${post.id}`}
							isActive={post.replyCount > 0}
							colorScheme="violet"
							buttonText={
								post.replyCount > 0
									? `${post.replyCount} Comments`
									: post.replyCount === 0
									? 'Comment'
									: '1 Comment'
							}
							iconName={post.replyCount > 0 ? 'comment_filled' : 'comment_fillable'}
						/>
					)}
					{currentUser && (
						<InteractionButton
							type="button"
							isActive={post.likeCount > 0}
							colorScheme="pink"
							buttonText={
								post.likeCount > 0 ? `${post.likeCount} Likes` : post.likeCount === 0 ? 'Like' : '1 Like'
							}
							iconName={post.likedByUser ? 'heart_filled' : 'heart_fillable'}
							onClick={handleLike}
						/>
					)}
					{setting.copyLink && (
						<CopyToClipboardButton
							defaultButtonText="Copy Link"
							activeButtonText="Link copied"
							shareText={`${process.env.NEXT_PUBLIC_VERCEL_URL}/mumble/public/${post.id}`}
						/>
					)}

					{onDeletePost && currentUser && currentUser.id === post.user.id && (
						<InteractionButton
							type="button"
							colorScheme="pink"
							buttonText="Delete"
							iconName="cancel"
							onClick={handleDeletePost}
						/>
					)}
				</Grid>
			)}

			{showImageModal && <ImageModal picture={picture} onClose={() => setShowImageModal(false)} />}
		</UserContentCard>
	);
};
