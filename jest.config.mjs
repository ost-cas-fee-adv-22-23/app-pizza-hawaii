/** @type {import('ts-jest').JestConfigWithTsJest} */
import nextJest from 'next/jest.js';

const babelConfigStyledComponents = {
	presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
};

const customJestConfig = {
	verbose: true,
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'@/(.*)$': '<rootDir>/src/$1',
		'@smartive-education/pizza-hawaii': '<rootDir>/node_modules/@smartive-education/pizza-hawaii/dist/index.js',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/src/__mocks__/fileMock.js',
	},
	/* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
	transform: {
		'^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigStyledComponents],
	},
	testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/, <rootDir>/src/__tests__/, <rootDir>/src/__mocks__/',
	],
};

const createJestConfig = nextJest({ dir: './' });

const config = async () => ({
	...(await createJestConfig(customJestConfig)()),
	transformIgnorePatterns: ['node_modules/(?!(@smartive-education/pizza-hawaii)/)', '^.+\\.module\\.(css|sass|scss)$'],
});

export default config;
