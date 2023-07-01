import { expect, test } from '@playwright/test';

/**
 * This test suite tests the following:
 * 1. Logout from the app
 */

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const loginUrl = `${appUrl}/auth/login`;

test('Logout from App', async ({ page }) => {
	// Step 0: Open page
	await page.goto('/');

	// Step 1: Click on the logout button
	await page?.locator(`[data-testid="logout-button"]`).click();

	// Step 2: Check if the login page is visible
	await page.waitForURL(loginUrl);
	await expect(page).toHaveURL(loginUrl);
});
