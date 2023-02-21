import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

type Props = {
	user: {
		userName: string;
	};
};

export default function UserPage({ user }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	// fetch user data

	return (
		<>
			<h1>{user.userName}</h1>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query: { userName } }) => {
	return {
		props: {
			user: { userName },
		},
	};
};
