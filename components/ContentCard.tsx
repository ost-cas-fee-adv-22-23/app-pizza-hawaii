/* eslint-disable import/no-unresolved */
import React, { FC } from 'react';
import {
	Image,
	Label,
	Grid,
	TimeStamp,
	Richtext,
	UserName,
	IconLink,
	ImageOverlay,
	InteractionButton,
	CopyToClipboardButton,
	UserContentCard,
	TUserContentCard,
} from '@smartive-education/pizza-hawaii';

import ProjectSettings from '../data/ProjectSettings.json';
import { Post } from '../types/Post';

/*
 * Type
 */

type TContentCard = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: Post;
	profileLink?: string;
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

export const ContentCard: FC<TContentCard> = ({ variant, post }) => {
	const setting = contentCardvariantMap[variant] || contentCardvariantMap.detailpage;

	const headerSlotContent = (
		<Grid variant="col" gap="S">
			<Label as="span" size={setting.headlineSize}>
				{`${post.creator.firstName} ${post.creator.lastName}`}
			</Label>
			<Grid variant="row" gap="S">
				<UserName href={`/user/${post.creator.userName}`}>{post.creator.userName}</UserName>
				<IconLink as="span" icon="calendar" colorScheme="slate" size="S">
					<TimeStamp date={post.createdAt} />
				</IconLink>
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: post.creator.avatarUrl,
				userName: post.creator.userName,
				href: `/user/${post.creator.userName}`,
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
						throw new Error('Function not implemented.');
					}}
				>
					<Image
						width={ProjectSettings.images.post.width}
						height={
							(ProjectSettings.images.post.width / ProjectSettings.images.post.aspectRatio[0]) *
							ProjectSettings.images.post.aspectRatio[1]
						}
						src={post.mediaUrl}
						alt={`Image of ${post.creator.firstName} ${post.creator.lastName}`}
					/>
				</ImageOverlay>
			)}

			<Grid variant="row" gap="M" wrapBelowScreen="md">
				<InteractionButton
					as="a"
					href="/link/to/post"
					isActive={post.replyCount > 0}
					colorScheme="violet"
					buttonText={
						post.replyCount > 0 ? `${post.replyCount} Comments` : post.replyCount === 0 ? 'Comment' : '1 Comment'
					}
					iconName={post.replyCount > 0 ? 'comment_filled' : 'comment_fillable'}
					onClick={function (): void {
						console.log('add comment');
						throw new Error('Function not implemented.');
					}}
				/>
				<InteractionButton
					as="button"
					type="button"
					isActive={post.likeCount > 0}
					colorScheme="pink"
					buttonText={post.likeCount > 0 ? `${post.likeCount} Likes` : post.likeCount === 0 ? 'Like' : '1 Like'}
					iconName={post.likeCount > 0 ? 'heart_filled' : 'heart_fillable'}
					onClick={function (): void {
						console.log('add like');
						throw new Error('Function not implemented.');
					}}
				/>

				<CopyToClipboardButton
					defaultButtonText="Copy Link"
					activeButtonText="Link copied"
					shareText="/url/to/post"
				/>
			</Grid>
		</UserContentCard>
	);
};
