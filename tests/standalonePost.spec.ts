import { expect, test } from '@playwright/test';

test('render a single post view when not logged in', async ({ page }) => {
	await page.goto('http://localhost:3000/mumble/01GYX2NAVWCNCQNX7RV5SZARJK');
	// metatitle of single post view
	const paragraphText = page.getByText('Wo sind denn');
	expect(paragraphText).toContainText('Wo sind denn all die #hashtags hin?');
	await expect(page).toHaveTitle(/Mumble von user624/);
});

test('test if login link of header works on stanalone post page', async ({ page }) => {
	await page.goto('http://localhost:3000/mumble/01GYX2NAVWCNCQNX7RV5SZARJK');
	await page.getByRole('link', { name: 'Login' }).click();
	await expect(page).toHaveURL(/.*login/);
});
