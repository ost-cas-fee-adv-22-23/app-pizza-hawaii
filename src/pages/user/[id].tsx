import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { TUser } from '../../types';
import { services } from '../../services';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { UserProfile, Image, Card, Headline, UserName, IconLink, TimeStamp } from '@smartive-education/pizza-hawaii';

type Props = {
	user: {
		userData: TUser;
	};
};

export default function UserPage(props: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState();
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
		console.log('%c[id].tsx line:22 res', 'color: #26bfa5;', res);
	};
	return isLoading && !userData ? (
		<span>loading Data</span>
	) : (
		<div className="bg-slate-100">
			<Card as="div" rounded size="M">
				<div className="relative mb-6">
					<Image
						className="max-height: h-80"
						src={'//picsum.photos/seed/johndoe1/1600/1157/'}
						alt={userData?.user?.userName}
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
						{/* <TimeStamp date={userData.user.createdAt} prefix="Mitglied seit" /> */}
						{/* <TimeStamp date='' prefix="Mitglied seit" /> */}
					</IconLink>
				</span>
			</Card>
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
