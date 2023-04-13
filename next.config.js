/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
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
});
