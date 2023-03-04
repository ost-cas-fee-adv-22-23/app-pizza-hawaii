import { ReactElement, FC } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Header } from './Header';
import { TUser } from '../types';

type TMainLayout = {
	children: ReactElement | JSX.Element;
};

export const MainLayout: FC<TMainLayout> = ({ children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	return (
		<>
			<Head>
				<link rel="icon" href="favicon.svg" />
			</Head>
			{currentUser && <Header user={currentUser} />}
			<div className="w-screen h-screen bg-slate-100">
				<div className="w-full sm:w-7/12 px-s my-0 mx-auto">{children}</div>
			</div>
		</>
	);
};

export default MainLayout;
