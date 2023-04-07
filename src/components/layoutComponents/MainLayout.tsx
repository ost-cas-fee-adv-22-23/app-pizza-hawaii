import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { FC, ReactElement } from 'react';

import { TUser } from '../../types';
import { Footer } from '../Footer';
import { Header } from '../Header';

type TMainLayout = {
	title: string;
	description?: string;
	children: ReactElement | JSX.Element;
};

export const MainLayout: FC<TMainLayout> = ({ title, description, children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	return (
		<>
			<Head>
				<title>{title}</title>
				{description && <meta name="description" content={description} />}
			</Head>

			{currentUser && <Header user={currentUser} />}

			<main className="px-content mb-24">
				<section className="mx-auto w-full max-w-content">{children}</section>
			</main>
			<Footer />
		</>
	);
};

export default MainLayout;
