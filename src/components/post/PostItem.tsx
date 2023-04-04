import React, { FC, useState } from 'react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

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
	InteractionButton,
} from '@smartive-education/pizza-hawaii';

import { TPost, TUser } from '../../types';
import ProjectSettings from '../../data/ProjectSettings.json';
import { postsService } from '../../services/api/posts/';
import ImageModal from '../ImageModal';

/*
 * Type
 */

type TPostItemProps = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	onDeletePost?: (id: string) => void;
};

type TPostItemVariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
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

export const PostItem: FC<TPostItemProps> = ({ variant, post, onDeletePost }) => {
	const [likedByUser, setLikedByUser] = useState(post.likedByUser);
	const [likeCount, setLikeCount] = useState(post.likeCount);
	const [showImageModal, setShowImageModal] = useState(false);

	const { data: session } = useSession();
	const currentUser = session?.user as TUser;

	const setting = postItemVariantMap[variant] || postItemVariantMap.detailpage;
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

	// mayby we do a helper function hook or a component for this as ImageModal is used in userpanorama image as well
	// ImageModal function
	const toggleImageModal = () => {
		setShowImageModal(!showImageModal);
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
				<ImageOverlay preset="enlarge" buttonLabel="Enlarge image in modal" onClick={toggleImageModal}>
					<Image
						width={ProjectSettings.images.post.width}
						height={
							(ProjectSettings.images.post.width / ProjectSettings.images.post.aspectRatio[0]) *
							ProjectSettings.images.post.aspectRatio[1]
						}
						src={post.mediaUrl}
						alt={`Image of ${post.user.displayName}`}
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
					shareText={`${process.env.NEXT_PUBLIC_VERCEL_URL}/mumble/${post.id}`}
				/>

				{currentUser && currentUser.id === post.user.id && (
					<InteractionButton
						type="button"
						colorScheme="pink"
						buttonText="Delete"
						iconName="cancel"
						onClick={handleDeletePost}
					/>
				)}
			</Grid>

			{showImageModal && <ImageModal post={post} toggleHandler={setShowImageModal} />}
		</UserContentCard>
	);
};
