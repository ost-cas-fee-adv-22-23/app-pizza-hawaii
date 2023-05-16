/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config) => {
		config.resolve.fallback = { fs: false };
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cas-fee-advanced-ocvdad.zitadel.cloud',
				pathname: '/assets/**',
			},
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				pathname: '/qwacker-api-prod-data/**',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
		],
	},
	i18n: {
		locales: ['de'],
		defaultLocale: 'de',
	},
};

// const withPWA = require('next-pwa')({
// 		dest: 'public',
// 		register: true,
// 		skipWaiting: true,
// 		//disable: process.env.NODE_ENV === 'development',
// });

// module.exports = withPWA(nextConfig);

module.exports = nextConfig;
