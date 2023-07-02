/** @type {import('ts-jest').JestConfigWithTsJest} */
import nextJest from 'next/jest.js';

const customJestConfig = {
	verbose: true,
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'@/(.*)$': '<rootDir>/src/$1',
		'@smartive-education/pizza-hawaii': '<rootDir>/node_modules/@smartive-education/pizza-hawaii/dist/index.js',
	},
	// match all test files with .test.(js|jsx|ts|tsx) extension in the __tests__ folder and in any subdirectory
	// dont match .spec. files as they are used for integration tests (playwright)
	testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/src/__mocks__/'],
};

const createJestConfig = nextJest({ dir: './' });

const config = async () => ({
	...(await createJestConfig(customJestConfig)()),
	transformIgnorePatterns: [
		'node_modules/(?!(@smartive-education/pizza-hawaii|jose|@panva|uuid)/)',
		'^.+\\.module\\.(css|sass|scss)$',
	],
});

export default config;
