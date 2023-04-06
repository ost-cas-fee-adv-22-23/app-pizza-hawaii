/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const config = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'cas-fee-advanced-ocvdad.zitadel.cloud' },
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				pathname: '/qwacker-api-prod-data/**',
			},
		],
	},
};

const nextConfig = withPWA({
	dest: 'public',
	runtimeCaching,
})(config);

module.exports = nextConfig;
