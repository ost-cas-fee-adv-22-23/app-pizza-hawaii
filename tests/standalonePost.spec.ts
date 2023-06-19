import { expect, test } from '@playwright/test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const testPostUrl = `${appUrl}/mumble/01GYX2NAVWCNCQNX7RV5SZARJK`;

const testPostText = 'Wo sind denn all die #hashtags hin?';
const testPostUser = 'user624';

test.beforeEach(async ({ page }) => {
	// logout
	await page.context().clearCookies();
	await page.goto(`${appUrl}/auth/logout`);
});

test('render a single post view when not logged in', async ({ page }) => {
	await page.goto(testPostUrl);

	await page.waitForURL(testPostUrl);

	// check if the post is visible
	const post = page.getByText(testPostText);
	await expect(post).toBeVisible();

	// check if the post is from user
	await expect(page).toHaveTitle(`Mumble von ${testPostUser}`);
});

test('test if login link of header works on stanalone post page', async ({ page }) => {
	await page.goto(testPostUrl);

	await page.waitForURL(testPostUrl);

	await page.getByRole('link', { name: 'Login' }).click();
	await expect(page).toHaveURL(`${appUrl}/auth/login`);
});
