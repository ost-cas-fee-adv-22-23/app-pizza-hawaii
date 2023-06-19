import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	globalSetup: './tests/global.setup.ts',
	outputDir: './tmp/test-results',
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: process.env.NEXT_PUBLIC_VERCEL_URL,
		trace: 'on-first-retry',
		storageState: './tmp/state.json',
		screenshot: 'only-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'login',
			testMatch: '**/*.setup.ts',
		},
		{
			name: 'logged in chromium',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '**/*.loggedin.spec.ts',
			dependencies: ['login'],
		},
		{
			name: 'logged out chromium',
			use: { ...devices['Firefox'] },
			testIgnore: ['**/*.loggedin.spec.ts'],
		},
		// {
		// 	name: 'chromium',
		// 	use: {
		// 		...devices['Chrome'],
		// 	},
		// 	dependencies: ['setup'],
		// },
		// {
		// 	name: 'firefox',
		// 	use: { ...devices['Firefox'] },
		// 	dependencies: ['setup'],
		// },
		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Safari'] },
		// 	dependencies: ['setup'],
		// },
		// {
		// 	name: 'Mobile Chrome',
		// 	use: { ...devices['Pixel 5'] },
		// 	dependencies: ['setup'],
		// },
		// {
		// 	name: 'Mobile Safari',
		// 	use: { ...devices['iPhone 12'] },
		// 	dependencies: ['setup'],
		// },
	],
});
