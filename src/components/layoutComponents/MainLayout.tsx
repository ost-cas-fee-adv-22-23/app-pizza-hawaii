import { ReactElement, FC } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '../Header';
import { TUser } from '../../types';

type TMainLayout = {
	children: ReactElement | JSX.Element;
};

export const MainLayout: FC<TMainLayout> = ({ children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	return (
		<div className="bg-slate-100">
			{currentUser && <Header user={currentUser} />}

			<main className="px-content">
				<section className="mx-auto w-full max-w-content">{children}</section>
			</main>
		</div>
	);
};

export default MainLayout;
