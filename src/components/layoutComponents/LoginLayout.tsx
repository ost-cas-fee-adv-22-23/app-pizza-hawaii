import { Headline } from '@smartive-education/pizza-hawaii';
import Head from 'next/head';
import NextImage from 'next/image';
import { FC, ReactNode } from 'react';

import VerticalLogo from '../../assets/svg/verticalLogo.svg';
import { Footer } from '../Footer';

type TLoginLayout = {
	title: string;
	description?: string;
	children: ReactNode;
};

export const LoginLayout: FC<TLoginLayout> = ({ title, description, children }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
				{description && <meta name="description" content={description} />}
			</Head>
			<div className="SplitScreen grid grid-rows-1 grid-cols-2 md:grid-cols-1 w-screen min-h-screen">
				<header className="column-start-1 column-span-1 row-start-1 row-span-1 flex items-center justify-center bg-gradient-to-tl from-violet-600 to-pink-500">
					<div className="w-8/12 text-pink-300 text-center">
						<div className="inline-block mb-8">
							<NextImage src={VerticalLogo} alt="welcome to Mumble" />
						</div>
						<Headline level={1}>
							Find out what’s new in{' '}
							<a href="#fashion" className="text-white">
								#Frontend Engineering
							</a>
							.
						</Headline>
					</div>
				</header>
				<div className="column-start-2 column-span-1 row-start-1 row-span-1 md:column-start-1 md:row-start-2 flex flex-col items-center justify-center">
					<main className="w-8/12 flex-auto flex flex-col items-center justify-center">
						<section>{children}</section>
					</main>
					<Footer />
				</div>
			</div>
		</>
	);
};

export default LoginLayout;
