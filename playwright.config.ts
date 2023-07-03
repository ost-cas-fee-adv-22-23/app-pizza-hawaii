import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export const defaultStateFile = './tmp/state.json';
export const authStateFile = './tmp/auth.json';

const testBrowsers = process.env.browsers?.split(',') || ['firefox']; // ['firefox', 'chromium', 'mobile_chrome'];

const browserVersions = {
	firefox: {
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] },
	},
	chromium: {
		name: 'chromium',
		use: { ...devices['Desktop Chrome'] },
	},
	mobile_chrome: {
		name: 'chromium',
		use: { ...devices['Pixel 5'] },
	},
} as Record<string, PlaywrightTestConfig>;

const testBrowserConfig = testBrowsers.map((browser) => browserVersions[browser]).filter((browser) => browser);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	globalSetup: './tests/e2e/global.setup.ts',
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
			name: `${browser.name} - logged in`,
			use: { ...browser.use, storageState: authStateFile },
			testMatch: '**/*.loggedin.spec.ts',
		})),
	],
});
