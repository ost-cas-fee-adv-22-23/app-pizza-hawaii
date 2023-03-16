import React, { FC } from 'react';
import {
	Button,
	Label,
	Grid,
	FormTextarea,
	UserName,
	UserContentCard,
	TUserContentCard,
} from '@smartive-education/pizza-hawaii';

import { TPost, TUser } from '../types';
import { services } from '../services';

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
	const { variant, placeHolderText, author, replyTo } = props;
	const setting = ContentInputCardVariantMap[variant] || ContentInputCardVariantMap.newPost;
	const [text, setText] = React.useState<string>('');
	const testimage = null;

	const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
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

			<Grid variant="row" gap="S" wrapBelowScreen="md">
				<Button as="button" colorScheme="slate" icon="upload">
					Bild Hochladen
				</Button>
				<Button as="button" colorScheme="violet" icon="send" onClick={(e) => onSubmitHandler(e)}>
					Absenden
				</Button>
			</Grid>
		</UserContentCard>
	);
};
