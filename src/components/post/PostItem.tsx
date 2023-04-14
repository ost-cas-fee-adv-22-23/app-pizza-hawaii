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
import React, { FC, useState } from 'react';

import ProjectSettings from '../../data/ProjectSettings.json';
import { postsService } from '../../services/api/posts/';
import { TPost, TUser } from '../../types';
import ImageModal, { TModalPicture } from '../ImageModal';

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

export const PostItem: FC<TPostItemProps> = ({ variant, post, onDeletePost, onAnswerPost }) => {
	const [likedByUser, setLikedByUser] = useState(post?.likedByUser);
	const [likeCount, setLikeCount] = useState(post?.likeCount);
	const [showImageModal, setShowImageModal] = useState(false);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const setting = postItemVariantMap[variant] || postItemVariantMap.detailpage;
	const replyCount = post?.replyCount || 0;

	// like and unlike function
	const handleLike = async () => {
		if (likedByUser) {
			postsService.unlike({ id: post?.id }).then(() => {
				setLikeCount(likeCount - 1);
			});
		} else {
			postsService.like({ id: post?.id }).then(() => {
				setLikeCount(likeCount + 1);
			});
		}
		setLikedByUser(!likedByUser);
	};

	// handle answer function
	const handleAnswerPost = () => {
		onAnswerPost && onAnswerPost(post?.id);
	};

	// delete function
	const handleDeletePost = async () => {
		onDeletePost && onDeletePost(post?.id);
	};

	const isFreshPost = new Date(post.createdAt).getTime() > new Date().getTime() - 45 * 60 * 1000;
	const picture: TModalPicture = {
		src: post.mediaUrl,
		width: ProjectSettings.images.post.width,
		height:
			(ProjectSettings.images.header.width / ProjectSettings.images.header.aspectRatio[0]) *
			ProjectSettings.images.header.aspectRatio[1],
		alt: `Image of ${post.user.displayName}`,
	};

	const headerSlotContent = (
		<Grid variant="col" gap="S">
			<Label as="span" size={setting.headlineSize}>
				{`${post?.user.displayName}`}
			</Label>
			<Grid variant="row" gap="S">
				<NextLink href={post?.user.profileLink}>
					<IconText icon="profile" colorScheme="violet" size="S">
						{post?.user.userName}
					</IconText>
				</NextLink>
				{post.createdAt && new Date(post.createdAt) && (
					<IconText icon="calendar" colorScheme="slate" size="S">
						{isFreshPost ? (
							<time
								title={
									new Date(post.createdAt).toLocaleDateString('de-CH') +
									' ' +
									new Date(post.createdAt).toLocaleTimeString('de-CH', {
										hour: '2-digit',
										minute: '2-digit',
									})
								}
								dateTime={new Date(post.createdAt).toISOString()}
							>
								gerade eben
							</time>
						) : (
							<TimeStamp date={post?.createdAt} />
						)}
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
						width={ProjectSettings.images.post.width}
						height={
							(ProjectSettings.images.post.width / ProjectSettings.images.post.aspectRatio[0]) *
							ProjectSettings.images.post.aspectRatio[1]
						}
						src={post.mediaUrl}
						alt={`Image of ${post.user.displayName}`}
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
							isActive={replyCount > 0}
							colorScheme="violet"
							buttonText={
								replyCount > 0 ? `${replyCount} Comments` : replyCount === 0 ? 'Comment' : '1 Comment'
							}
							iconName={replyCount > 0 ? 'comment_filled' : 'comment_fillable'}
						/>
					)}
					{currentUser && (
						<InteractionButton
							type="button"
							isActive={likeCount > 0}
							colorScheme="pink"
							buttonText={likeCount > 0 ? `${likeCount} Likes` : likeCount === 0 ? 'Like' : '1 Like'}
							iconName={likedByUser ? 'heart_filled' : 'heart_fillable'}
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
