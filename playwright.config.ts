import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const testBrowsers = process.env.browsers?.split('|') || ['Firefox']; // ['Firefox', 'Chrome', 'Safari', 'Mobile Chrome', 'Mobile Safari'];

export default defineConfig({
	globalSetup: './tests/global.setup.ts',
	outputDir: './tmp/test-results',
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	timeout: 30 * 1000,
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
		...testBrowsers.map((browser) => ({
			name: `logged in ${browser}`,
			use: { ...devices[browser] },
			testMatch: '**/*.loggedin.spec.ts',
			dependencies: ['login'],
		})),
		...testBrowsers.map((browser) => ({
			name: `logged out ${browser}`,
			use: { ...devices[browser] },
			testIgnore: ['**/*.loggedin.spec.ts'],
		})),
	],
});
