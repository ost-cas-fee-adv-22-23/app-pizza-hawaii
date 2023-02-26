import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { TUser } from '../../types';
import { UserCardModel } from '../../models/UserCard';
import { services } from '../../services';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
	UserProfile,
	Image,
	Card,
	Headline,
	UserName,
	IconLink,
	TimeStamp,
	Richtext,
	Button,
	Grid,
} from '@smartive-education/pizza-hawaii';

type Props = {
	user: {
		userData: TUser;
	};
};

export default function UserPage(props: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState(undefined);
	const router = useRouter();
	const { data: session } = useSession();
	const userId = router.query.id?.toString();

	useEffect(() => {
		const fetchData = async () => {
			const userData = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
			console.log('%c[id].tsx line:22 userData', 'color: #26bfa5;', userData);
			setUserData({ user: userData });
			setIsLoading(false);
		};
		fetchData();
	}, [userId, session]);

	const loadUserData = async (userId: string) => {
		const res = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
	};

	// TODO: probably somewhere else as a helperClass
	const unfollowUser = (id: string) => {
		console.log('unfollow user with user id', id);
	};

	return isLoading && !userData ? (
		<span>loading Data... - a loading animation would be nice- </span>
	) : (
		<div className="bg-slate-100">
			<Card as="section" rounded size="M" className="bg-slate-100">
				<div className="relative mb-6">
					<Image
						className="max-height: h-80"
						src={userData?.user.backgroundImage}
						alt={userData?.user?.userName}
						preset="header"
					/>
					<div className="absolute right-8 bottom-0 translate-y-1/2 z-10">
						<UserProfile
							userName={userData.user.userName}
							avatar={userData.user.avatarUrl}
							size="XL"
							border={true}
							href="/"
							buttonLabel={userData.user.userName}
						/>
					</div>
				</div>
				<div className="mb-2 text-slate-900 pr-48">
					<Headline level={3}>
						{userData.user.firstName} {userData.user.lastName}
					</Headline>
				</div>
				<span className="flex flex-row align-baseline gap-3 mb-3">
					<UserName href={userData.user.profileLink}>{userData.user.userName}</UserName>

					<IconLink as="span" icon="location" colorScheme="slate" size="S">
						CityName
					</IconLink>

					<IconLink as="span" icon="calendar" colorScheme="slate" size="S">
						<TimeStamp date={userData.user.createdAt} prefix="Mitglied seit" />
					</IconLink>
				</span>
				<div className="text-slate-400 mb-8">
					<Richtext size="M">{userData.user.bio}</Richtext>
				</div>
				<div className="text-right flex flex-row max-w-[50%]">
					<span>
						Du folgst {userData.user.firstName} {userData.user.lastName}{' '}
					</span>
					<Button
						onClick={() => unfollowUser(userData.user.id)}
						as="button"
						size="S"
						colorScheme="slate"
						icon="cancel"
					>
						Unfollow
					</Button>
				</div>
			</Card>
			<br />
			here should come all mumble-posts of that user
			<Grid variant="col" gap="M" as="div">
				<div>
					<h3>Hi there!</h3>
				</div>
				<div>
					<h3>Hi there!</h3>
				</div>
				<div>
					<h3>Hi there!</h3>
				</div>
			</Grid>
		</div>
	);
}
/*
export const getServerSideProps: GetServerSideProps = async ({ req, userId }) => {
	const session = await getToken({ req });
	if (!session) {
		return {
			props: { userData: null, error: 'not logged in, no session' },
		};
	}
	try {
		const userData: TUser = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });

		console.log('dataset userData:', userData);
		return {
			props: {
				user: userData,
			},
		};
	} catch (error) {
		console.log(error);
		throw new Error('getUserByPostId: No valid UserId was provided');
	}

};
*/
