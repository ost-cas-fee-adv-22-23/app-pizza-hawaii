import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

describe('Test public posts.', () => {
	const timelineUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
	const testPostUrl = `${timelineUrl}/mumble/01GYX2NAVWCNCQNX7RV5SZARJK`;
	const testPostText = 'Wo sind denn all die #hashtags hin?';
	const testPostUser = 'user624';

	test('render a single post view when not logged in', async ({ page }) => {
		await page.goto(testPostUrl);

		// check if the post is visible
		const post = page.getByText(testPostText);
		await expect(post).toBeVisible();

		// check if the post is from user
		await expect(page).toHaveTitle(`Mumble von ${testPostUser}`);
	});

	test('test if login link of header works on stanalone post page', async ({ page }) => {
		await page.goto(testPostUrl);
		await page.getByRole('link', { name: 'Login' }).click();
		await expect(page).toHaveURL(`${timelineUrl}/auth/login`);
	});
});
