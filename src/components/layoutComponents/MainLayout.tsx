import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { FC, ReactElement } from 'react';

import { TUser } from '../../types';
import { Footer } from '../Footer';
import { Header } from '../Header';

type TMainLayout = {
	title: string;
	seo: {
		description?: string;
		image?: {
			url: string;
			type?: string;
			alt?: string;
		};
		pageType?: string;
	};
	children: ReactElement | JSX.Element;
};

export const MainLayout: FC<TMainLayout> = ({ title, seo, children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	function shortenText(text: string, maxLength: number) {
		if (text.length <= maxLength) {
			return text;
		}

		// shorten to the nearest word
		return `${text.substr(0, text.lastIndexOf(' ', maxLength))}...`;
	}

	const seoDescription = seo.description ? shortenText(seo.description, 150) : '';

	const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{seoDescription && <meta name="description" content={seoDescription} />}
				{title && <meta property="og:title" content={title} />}
				{seoDescription && <meta property="og:description" content={seoDescription} />}
				{seo.image && <meta property="og:image" content={seo.image.url} />}
				{seo.image && seo.image.type && <meta property="og:image:type" content={seo.image.type} />}
				{seo.image && seo.image && <meta property="og:image:alt" content={seo.image.alt || title} />}
				{seo.pageType && <meta property="og:type" content={seo.pageType} />}

				<meta property="og:site_name" content="Mumble" />
				<meta property="og:url" content={currentUrl} />
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
