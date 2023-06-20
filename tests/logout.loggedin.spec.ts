import { expect, test } from '@playwright/test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const loginUrl = `${appUrl}/auth/login`;

test('Logout from mumble', async ({ page }) => {
	// Step 0: Open page
	await page.goto('/');

	// Step 1: Click on the logout button
	page.getByRole('button', { name: 'Log out' }).click();

	// Step 2: Check if the login page is visible
	await page.waitForURL(loginUrl);
	await expect(page).toHaveURL(loginUrl);
});
