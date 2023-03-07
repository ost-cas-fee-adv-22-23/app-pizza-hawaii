import Head from 'next/head';
import { FC } from 'react';
import Image from 'next/image';
import { Headline } from '@smartive-education/pizza-hawaii';
import VerticalLogo from '../../assets/svg/verticalLogo.svg';

type TLoginLayout = {
	children: React.ReactNode;
};

const LoginLayout: FC<TLoginLayout> = ({ children }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<title>Login to Mumble</title>
			</Head>
			<div className="SplitScreen grid grid-rows-1 grid-cols-2 md:grid-cols-1 w-screen min-h-screen">
				<header className="column-start-1 column-span-1 row-start-1 row-span-1 flex items-center justify-center bg-gradient-to-tl from-violet-600 to-pink-500">
					<div className="w-8/12 text-pink-300 text-center">
						<div className="inline-block mb-8">
							<Image src={VerticalLogo} alt="welcome to Mumble" />
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
				<div className="column-start-2 column-span-1 row-start-1 row-span-1 md:column-start-1 md:row-start-2 flex items-center justify-center">
					<section className="w-8/12">{children}</section>
				</div>
			</div>
		</>
	);
};

export default LoginLayout;
