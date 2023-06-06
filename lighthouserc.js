const LHCI_SERVER_BASE_URL = 'https://app-pizza-hawaii.vercel.app';

module.exports = {
	ci: {
		collect: {
			startServerCommand: 'npm run build && npm run start',
			startServerReadyPattern: 'ready on',
			url: [`${LHCI_SERVER_BASE_URL}/auth/login`, `${LHCI_SERVER_BASE_URL}/auth/signup`],
			numberOfRuns: 2,
			settings: { preset: 'desktop' },
		},
		assert: {
			assertions: {
				'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
				'categories:performance': ['warn', { minScore: 0.9, aggregationMethod: 'optimistic' }],
				'categories:accessibility': ['warn', { minScore: 1, aggregationMethod: 'optimistic' }],
				'categories:best-practices': ['warn', { minScore: 0.9, aggregationMethod: 'optimistic' }],
				'dom-size': ['error', { maxNumericValue: 3000 }],
				'categories:seo': ['error', { minScore: 0.9 }],
				'installable-manifest': 'on',
				'service-worker': 'on',
			},
		},
		upload: {
			target: 'temporary-public-storage',
		},
	},
};
