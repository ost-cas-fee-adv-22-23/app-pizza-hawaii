import { chromium, expect, FullConfig } from '@playwright/test';
const stateFile = './tmp/state.json';
const authFile = './tmp/auth.json';

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use as {
		baseURL: string;
	};

	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await browser.newPage();

	try {
		await context.tracing.start({ screenshots: true, snapshots: true });

		// Step 1: Open the login page via the Mumble login button
		await page.goto(baseURL);
		await page.waitForSelector('button:has-text("Login via Zitadel")');

		await page.context().storageState({ path: stateFile as string });

		const loginButton = await page.getByRole('button', { name: 'Login via Zitadel' });
		await loginButton.click();

		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/login.*/);

		// Step 2: Fill in the username
		await page.fill('input[name="loginName"]', process.env.ZITADEL_USERNAME as string);
		await page.keyboard.press('Enter');

		// Check if we are on the zitadel password page
		await page.waitForURL(/.*.zitadel.cloud\/ui\/login\/loginname.*/);

		// Step 3: Fill in the password
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		await page.keyboard.press('Enter');

		// Check if we are redirected to mumble timeline
		await page.waitForURL(baseURL);

		// Step 4: Save the storage state of logged in user to use it in the tests
		await page.context().storageState({ path: authFile as string });

		await browser.close();
	} catch (error) {
		await browser.close();
		throw error;
	}
}

export default globalSetup;
