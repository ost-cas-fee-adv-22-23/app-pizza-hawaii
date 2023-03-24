import React, { FC, useState } from 'react';
import NextLink from 'next/link';

import {
	Image,
	Label,
	Grid,
	TimeStamp,
	Richtext,
	IconText,
	ImageOverlay,
	CopyToClipboardButton,
	UserContentCard,
	TUserContentCard,
	Modal,
	InteractionButton,
} from '@smartive-education/pizza-hawaii';

import { TPost } from '../types';
import ProjectSettings from './../data/ProjectSettings.json';
import { postsService } from '../services/api/posts/';

/*
 * Type
 */

type TContentCard = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	canDelete?: boolean;
	onDeletePost?: (id: string) => void;
};

type TContentCardvariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
};

/*
 * Style
 */

const contentCardvariantMap: Record<TContentCard['variant'], TContentCardvariantMap> = {
	detailpage: {
		headlineSize: 'XL',
		textSize: 'L',
		avatarSize: 'M',
		avatarVariant: 'standalone',
	},
	timeline: {
		headlineSize: 'L',
		textSize: 'M',
		avatarSize: 'M',
		avatarVariant: 'standalone',
	},
	response: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
	},
};

export const ContentCard: FC<TContentCard> = ({ variant, post, canDelete = false, onDeletePost }) => {
	const [likedByUser, setLikedByUser] = useState(post.likedByUser);
	const [likeCount, setLikeCount] = useState(post.likeCount);
	const [showFullscreen, setShowFullscreen] = useState(false);

	const setting = contentCardvariantMap[variant] || contentCardvariantMap.detailpage;
	const replyCount = post?.replyCount || 0;

	// like and unlike function
	const handleLike = async () => {
		if (likedByUser) {
			postsService.unlike({ id: post.id }).then(() => {
				setLikeCount(likeCount - 1);
			});
		} else {
			postsService.like({ id: post.id }).then(() => {
				setLikeCount(likeCount + 1);
			});
		}
		setLikedByUser(!likedByUser);
	};

	// delete function
	const handleDeletePost = async () => {
		onDeletePost && onDeletePost(post.id);
	};

	// mayby we do a helper function hook or a component for this as fullscreen is used in userpanorama image as well
	// fullscreen function
	const toggleFullscreen = () => {
		setShowFullscreen(!showFullscreen);
	};

	const headerSlotContent = (
		<Grid variant="col" gap="S">
			<Label as="span" size={setting.headlineSize}>
				{`${post.user.displayName}`}
			</Label>
			<Grid variant="row" gap="S">
				<NextLink href={post.user.profileLink}>
					<IconText icon="profile" colorScheme="violet" size="S">
						{post.user.userName}
					</IconText>
				</NextLink>
				<IconText icon="calendar" colorScheme="slate" size="S">
					<TimeStamp date={post.createdAt} />
				</IconText>
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: post.user.avatarUrl,
				userName: post.user.userName,
				href: post.user.profileLink,
			}}
			avatarVariant={setting.avatarVariant}
			avatarSize={setting.avatarSize}
		>
			<Richtext size={setting.textSize}>{post.text}</Richtext>

			{post.mediaUrl && (
				<ImageOverlay
					preset="enlarge"
					buttonLabel="Open image in fullscreen"
					onClick={function (): void {
						toggleFullscreen();
					}}
				>
					<Image
						width={ProjectSettings.images.post.width}
						height={
							(ProjectSettings.images.post.width / ProjectSettings.images.post.aspectRatio[0]) *
							ProjectSettings.images.post.aspectRatio[1]
						}
						src={post.mediaUrl}
						alt={`Image of ${post.user.firstName} ${post.user.lastName}`}
					/>
				</ImageOverlay>
			)}

			<Grid variant="row" gap="M" wrapBelowScreen="md">
				<InteractionButton
					component={NextLink}
					href={`/mumble/${post.id}`}
					isActive={replyCount > 0}
					colorScheme="violet"
					buttonText={replyCount > 0 ? `${replyCount} Comments` : replyCount === 0 ? 'Comment' : '1 Comment'}
					iconName={replyCount > 0 ? 'comment_filled' : 'comment_fillable'}
				/>
				<InteractionButton
					type="button"
					isActive={likeCount > 0}
					colorScheme="pink"
					buttonText={likeCount > 0 ? `${likeCount} Likes` : likeCount === 0 ? 'Like' : '1 Like'}
					iconName={likedByUser ? 'heart_filled' : 'heart_fillable'}
					onClick={handleLike}
				/>

				<CopyToClipboardButton
					defaultButtonText="Copy Link"
					activeButtonText="Link copied"
					shareText={`${process.env.NEXTAUTH_URL}/mumble/${post.id}`}
				/>

				{canDelete && (
					<InteractionButton
						type="button"
						colorScheme="pink"
						buttonText="Delete"
						iconName="cancel"
						onClick={handleDeletePost}
					/>
				)}
			</Grid>
			{showFullscreen && (
				<Modal title="The Big Picture" isVisible={showFullscreen} onClose={() => toggleFullscreen()}>
					<Image width={1000} src={post.mediaUrl} alt={`Image of ${post.user.firstName} ${post.user.lastName}`} />
					<br />
					<Label as="legend" size="L">
						Posted by: {post.user.firstName}
					</Label>
				</Modal>
			)}
		</UserContentCard>
	);
};
