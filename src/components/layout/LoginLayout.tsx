import { Headline } from '@smartive-education/pizza-hawaii';
import Head from 'next/head';
import NextImage from 'next/image';
import { FC, ReactNode } from 'react';

import VerticalLogo from '../../../public/assets/svg/verticalLogo.svg';
import { Footer } from '../base/Footer';

type TLoginLayout = {
	title: string;
	seo?: {
		description?: string;
	};
	children: ReactNode;
	header?: ReactNode;
};

export const LoginLayout: FC<TLoginLayout> = ({ title, seo, children, header }) => {
	const seoDescription =
		seo?.description ||
		'Mumble ist eine Plattform für den Austausch von Wissen und Erfahrungen von Frontend Engineering Advanced (CAS) Abgänger:innen der OST.';

	const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{seoDescription && <meta name="description" content={seoDescription} />}
				{seoDescription && <meta property="og:description" content={seoDescription} />}

				<meta property="og:site_name" content="Mumble" />
				<meta property="og:url" content={currentUrl} />
			</Head>
			<div className="SplitScreen grid grid-rows-1 grid-cols-2 md:grid-rows-[minmax(200px,_50vh)_auto] md:grid-cols-1 w-screen min-h-screen">
				<header className="column-start-1 column-span-1 row-start-1 row-span-1 flex items-center justify-center bg-gradient-to-tl from-violet-600 to-pink-500 md:py-12">
					{header ? (
						header
					) : (
						<div className="w-8/12 text-pink-300 text-center">
							<div className="inline-block my-8">
								<NextImage src={VerticalLogo} alt="welcome to Mumble" priority={true} />
							</div>
							<div className="md:hidden">
								<Headline level={1} as="h1">
									Willkommen bei Mumble
								</Headline>
							</div>
						</div>
					)}
				</header>
				<div className="column-start-2 column-span-1 row-start-1 row-span-1 md:column-start-1 md:row-start-2 flex flex-col items-center justify-center">
					<main className="w-8/12 flex-auto flex flex-col items-center justify-center md:py-20">
						<section className="w-full">{children}</section>
					</main>
					<Footer />
				</div>
			</div>
		</>
	);
};

export default LoginLayout;
