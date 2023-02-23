import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { TUser } from '../../types';
import { services } from '../../services';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Props = {
	user: {
		userData: TUser;
	};
};

export default function UserPage(props :Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState();
	const router = useRouter();
	const { data: session } = useSession();
	const userId = router.query.id?.toString();

	useEffect(() => {
		const fetchData = async () => {
			const userData = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
			console.log('%c[id].tsx line:22 userData', 'color: #26bfa5;', userData);
			setUserData({user: userData})
			setIsLoading(false);
		};
		fetchData();
	}, [userId, session]);

	const loadUserData = async (userId: string) => {
		const res = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
		console.log('%c[id].tsx line:22 res', 'color: #26bfa5;', res);
	};
	return isLoading ? (
		<span>loading Data</span>
	) : (
		<>
			<h1>UserPage of: {userId}</h1>
			<button onClick={() => loadUserData(userId)}>get user by click!</button>
			{userData && (
				<>
					<h1>Vorname: {userData.user.firstName} </h1>
					<h1>Nachname: {userData.user.lastName} </h1>
				</>
			)}
		</>
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
