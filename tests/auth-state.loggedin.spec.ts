import { expect, Page, test } from '@playwright/test';

/**
 * Test Suite for the Login Header, Logout Function and Logout Header
 *
 * We test on the following pages:
 * 1. Default Page to check if the login header is visible and logout function is working
 * 2. PostDetail Page to check if the logout header is visible
 *
 * This test suite tests the following:
 * 1. Login Header
 * 2. Logout Function
 * 3. Logout Header
 *
 * The tests are running serially because we need the logged out state for the last test.
 */

const loginUrl = `/auth/login`;
const publicUrl = `/mumble/01GYX2NAVWCNCQNX7RV5SZARJK`;

test.describe.serial('Login Header, Logout Function and Logout Header', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/');
	});

	test('Check logged in header', async () => {
		// Step 1: Check if login and signup link is visible in the header
		await expect(page.locator(`[data-testid="logout-button-header"]`)).toBeVisible();
		await expect(page.locator(`[data-testid="settings-button-header"]`)).toBeVisible();
	});

	test('Logout from App', async () => {
		// Step 1: Click on the logout button
		await page?.locator(`[data-testid="logout-button-header"]`).click();

		// Step 2: Check if the login page is visible
		await page.waitForURL(loginUrl);
		await expect(page).toHaveURL(loginUrl);

		// Step 3: Check if the login form is visible
		await expect(page.locator(`[data-testid="login-button"]`)).toBeVisible();
	});

	test('Check logged out header', async () => {
		// Step 1: Go to the public page
		await page.goto(publicUrl);

		// Step 2: Check if login and signup link is visible in the header
		await expect(page.locator(`[data-testid="login-button-header"]`)).toBeVisible();
		await expect(page.locator(`[data-testid="signup-button-header"]`)).toBeVisible();
	});
});
