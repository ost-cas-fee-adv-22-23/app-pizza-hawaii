import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export const defaultStateFile = './tmp/state.json';
export const authStateFile = './tmp/auth.json';

const testBrowsers = process.env.browsers?.split(',') || ['Firefox']; // ['Firefox', 'Chrome', 'Safari', 'Mobile Chrome', 'Mobile Safari'];

const browserVersions = {
	Firefox: {
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] },
	},
	Chrome: {
		name: 'chromium',
		use: { ...devices['Desktop Chrome'] },
	},
	Safari: {
		name: 'webkit',
		use: { ...devices['Desktop Safari'] },
	},
	'Mobile Chrome': {
		name: 'chromium',
		use: { ...devices['Pixel 5'] },
	},
	'Mobile Safari': {
		name: 'webkit',
		use: { ...devices['iPhone 12'] },
	},
} as Record<string, PlaywrightTestConfig>;

const testBrowserConfig = testBrowsers.filter((browser) => browserVersions[browser]) as Array<PlaywrightTestConfig>;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/e2e',
	outputDir: './tmp/e2e-test-results',
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
		...testBrowserConfig.map((browser) => ({
			...browser,
			testIgnore: ['**/*.loggedin.spec.ts'],
		})),
		...testBrowserConfig.map((browser) => ({
			...browser,
			name: `logged in ${browser.name}`,
			use: { ...browser.use, storageState: authStateFile },
			testMatch: '**/*.loggedin.spec.ts',
		})),
	],
});
