module.exports = {
	ci: {
		collect: {
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
