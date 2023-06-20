import { expect, test } from '@playwright/test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const signupUrl = `${appUrl}/auth/signup`;
const signupPageTitle = 'Mumble - Registrierung';
const passwordMismatchFeedback = 'Die Passwörter stimmen nicht überein.';
const thePassword = 'secretPa$$word';
const wrongPassword = 'secretPa$$word-2different';

test('Register Form is visible', async ({ page }) => {
	// Step 0: Open page
	await page.goto(signupUrl);

	// Check if the Meta title is correct
	await expect(page).toHaveTitle(signupPageTitle);

	// Check if all fields are visible
	Promise.all(
		['First Name', 'Last Name', 'Username', 'E-Mail', 'Passwort', 'Passwort wiederholen'].map(async (field) => {
			await expect(page.getByText(field, { exact: true })).toBeVisible();
		})
	);
});

test('Register Form is working when passwords are different and passwordMismatchFeedback appears', async ({ page }) => {
	// Step 0: Open page
	await page.goto(signupUrl);

	// fill both password fields with different passwords
	await page.fill('input[name="password"]', thePassword);
	await page.fill('input[name="confirmPassword"]', wrongPassword);

	// wait 100ms
	await page.waitForTimeout(100);

	const passwordMismatchFeedbackEl = await page.getByText(passwordMismatchFeedback);

	// check if the user feedback element is visible
	await expect(passwordMismatchFeedbackEl).toBeVisible();
});

test('Register Form is working when passwords are the same', async ({ page }) => {
	// load the register page
	await page.goto(signupUrl);

	// fill both password fields with the same password
	await page.fill('input[name="password"]', thePassword);
	await page.fill('input[name="confirmPassword"]', thePassword);

	// wait 100ms
	await page.waitForTimeout(100);

	const passwordMismatchFeedbackEl = await page.getByText(passwordMismatchFeedback);

	// check if the user feedback element is not visible
	await expect(passwordMismatchFeedbackEl).not.toBeVisible();
});
