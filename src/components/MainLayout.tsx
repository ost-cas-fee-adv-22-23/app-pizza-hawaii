import Head from 'next/head';
import { Header } from './Header';
import { LayoutProps } from '../types/layoutProps';
import { useSession } from 'next-auth/react';
import { TUser } from '../types';

const MainLayout: LayoutProps = ({ children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	// TODO some fallback for failed login
	const emptyUser = {
		avatarUrl: '',
		firstName: '',
		id: '0000000000000',
		lastName: 'nobody',
		profileLink: '/user/nobody',
		userName: 'empty',
	};

	return (
		<>
			<Head>
				<link rel="icon" href="favicon.ico" />
			</Head>
			{currentUser && <Header user={currentUser} />}
			<div className="w-screen h-screen bg-slate-100">
				<div className="w-full sm:w-7/12 px-s my-0 mx-auto">{children}</div>
			</div>
		</>
	);
};

export default MainLayout;
