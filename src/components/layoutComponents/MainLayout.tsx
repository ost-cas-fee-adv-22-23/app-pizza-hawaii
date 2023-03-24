import { ReactElement, FC } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TUser } from '../../types';

type TMainLayout = {
	children: ReactElement | JSX.Element;
};

export const MainLayout: FC<TMainLayout> = ({ children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	return (
		<>
			{currentUser && <Header user={currentUser} />}

			<main className="px-content mb-24">
				<section className="mx-auto w-full max-w-content">{children}</section>
			</main>
			<Footer />
		</>
	);
};

export default MainLayout;
