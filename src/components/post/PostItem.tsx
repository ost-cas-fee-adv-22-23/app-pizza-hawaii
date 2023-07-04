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
import router from 'next/router';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useReducer, useRef, useState } from 'react';

import shortenString from '../../data/helpers/shortenString';
import ProjectSettings from '../../data/ProjectSettings.json';
import PDReducer, { ActionType as PDActionType, initialState as initialPDState } from '../../reducer/postDetailReducer';
import { postsService } from '../../services/api/posts/';
import { TPost, TUser } from '../../types';
import ImageModal, { TImageModalPicture } from '../widgets/ImageModal';

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
	showAnswerButton: boolean;
	showDeleteButton: boolean;
	showShareButton: boolean;
	showCommentButton: boolean;
	showLikeButton: boolean;
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
		showAnswerButton: true,
		showDeleteButton: true,
		showShareButton: true,
		showCommentButton: false,
		showLikeButton: true,
	},
	timeline: {
		headlineSize: 'L',
		textSize: 'M',
		avatarSize: 'M',
		avatarVariant: 'standalone',
		showAnswerButton: false,
		showDeleteButton: true,
		showShareButton: true,
		showCommentButton: true,
		showLikeButton: true,
	},
	response: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
		showAnswerButton: true,
		showDeleteButton: true,
		showShareButton: false,
		showCommentButton: false,
		showLikeButton: true,
	},
};

export const PostItem: FC<TPostItemProps> = ({ variant, post: initialPost, onDeletePost, onAnswerPost }) => {
	const [post, postDispatch] = useReducer(PDReducer, {
		...initialPDState,
		...initialPost,
	});

	const [showImageModal, setShowImageModal] = useState(false);
	const [hydrationDone, setHydrationDone] = useState(false);
	const userCardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setHydrationDone(true);
	}, []);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const setting = postItemVariantMap[variant] || postItemVariantMap.detailpage;

	const picture: TImageModalPicture = {
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

	// Scroll page to Item on click
	const handlePostClick = () => {
		router.push(`/mumble/${post.id}`, undefined, { shallow: true });

		const item = userCardRef.current;
		const header = document.querySelector('header') as HTMLElement;

		if (!item || !header) return;

		// get item position
		const itemPosition = item.getBoundingClientRect().top;

		// get header height
		const headerHeight = header.clientHeight;

		// get header margin
		const headerMargin = parseInt(window.getComputedStyle(header).getPropertyValue('margin-bottom'));

		// get scroll position
		const scrollPosition = window.pageYOffset;

		// scroll to item
		window.scrollTo({
			top: itemPosition + scrollPosition - headerHeight - headerMargin,
			behavior: 'smooth',
		});
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
		<div ref={userCardRef} data-testid="post-item">
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
				{post?.text.trim() !== '' && <Richtext size={setting.textSize}>{post.text}</Richtext>}

				{post.mediaUrl && (
					<ImageOverlay
						preset="enlarge"
						buttonLabel="Enlarge image in modal"
						onClick={() => setShowImageModal(true)}
					>
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
						{setting.showAnswerButton && onAnswerPost && (
							<InteractionButton
								type="button"
								colorScheme="violet"
								buttonText={'Answer'}
								iconName={'repost'}
								onClick={handleAnswerPost}
							/>
						)}
						{setting.showCommentButton && currentUser && (
							<InteractionButton
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
								onClick={handlePostClick}
								data-testid="comment-button"
								data-comments={post.replyCount}
							/>
						)}
						{setting.showLikeButton && currentUser && (
							<InteractionButton
								type="button"
								isActive={post.likeCount > 0}
								colorScheme="pink"
								buttonText={
									post.likeCount > 0 ? `${post.likeCount} Likes` : post.likeCount === 0 ? 'Like' : '1 Like'
								}
								iconName={post.likedByUser ? 'heart_filled' : 'heart_fillable'}
								onClick={handleLike}
								data-testid="like-button"
								data-likes={post.likeCount}
								data-liked={post.likedByUser}
							/>
						)}
						{setting.showShareButton && (
							<CopyToClipboardButton
								defaultButtonText="Copy Link"
								activeButtonText="Link copied"
								shareText={`${process.env.NEXT_PUBLIC_VERCEL_URL}/mumble/${post.id}`}
							/>
						)}

						{setting.showDeleteButton && onDeletePost && currentUser && currentUser.id === post.user.id && (
							<InteractionButton
								type="button"
								colorScheme="pink"
								buttonText="Delete"
								iconName="cancel"
								onClick={handleDeletePost}
								data-testid="delete-button"
							/>
						)}
					</Grid>
				)}

				{showImageModal && <ImageModal picture={picture} onClose={() => setShowImageModal(false)} />}
			</UserContentCard>
		</div>
	);
};
