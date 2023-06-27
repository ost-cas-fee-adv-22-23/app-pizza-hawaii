import { expect, test } from '@playwright/test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const testPostUrl = `${appUrl}/mumble/01GYX2NAVWCNCQNX7RV5SZARJK`;

const testPostText = 'Wo sind denn all die #hashtags hin?';
const testPostUser = 'user624';

test('Display a single post when not logged in', async ({ page }) => {
	// Step 0: Open page
	await page.goto(testPostUrl);

	// Step 1: Check if post is visible
	const post = page.getByText(testPostText);
	await expect(post).toBeVisible();

	// Step 2: Check if the post is from user
	await expect(page).toHaveTitle(`Mumble von ${testPostUser}`);
});

test('Test if login link of header works on standalone post page', async ({ page }) => {
	// Step 0: Open page
	await page.goto(testPostUrl);

	// Step 1: Check if login link is visible
	await page.getByRole('link', { name: 'Login' }).click();

	// Step 2: Check if login page is visible
	await expect(page).toHaveURL(`${appUrl}/auth/login`);
});
