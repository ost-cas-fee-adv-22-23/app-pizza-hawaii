import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<script
						dangerouslySetInnerHTML={{
							__html: `
                (function() {
                  if (typeof window !== "undefined") {
                    const themeFromStorage = localStorage.getItem('theme');
                    const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light';
                    const theme = themeFromStorage || defaultTheme;

					if (!themeFromStorage) {
						localStorage.setItem('theme', theme);
					}

                    document.documentElement.classList.add(theme);
                  }
                })();
              `,
						}}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
