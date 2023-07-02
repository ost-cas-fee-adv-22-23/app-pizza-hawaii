import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export const defaultStateFile = './tmp/state.json';
export const authStateFile = './tmp/auth.json';

const testBrowsers = process.env.browsers?.split(',') || ['Firefox']; // ['Firefox', 'Chrome', 'Safari', 'Mobile Chrome', 'Mobile Safari'];

export default defineConfig({
	globalSetup: './tests/e2e/global.setup.ts',
	outputDir: './tmp/e2e-test-results',
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	timeout: 30 * 1000,
	use: {
		baseURL: process.env.NEXT_PUBLIC_VERCEL_URL,
		screenshot: 'only-on-failure',
		storageState: defaultStateFile,
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		...testBrowsers.map((browser) => ({
			name: `logged out ${browser}`,
			use: { ...devices[browser] },
			testIgnore: ['**/*.loggedin.spec.ts'],
		})),
		...testBrowsers.map((browser) => ({
			name: `logged in ${browser}`,
			use: { ...devices[browser], storageState: authStateFile },
			testMatch: '**/*.loggedin.spec.ts',
		})),
	],
});
