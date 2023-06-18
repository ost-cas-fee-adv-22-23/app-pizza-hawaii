import { expect, Page, test } from '@playwright/test';
import { describe } from 'node:test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const signupUrl = `${appUrl}/auth/signup`;
const signupPageTitle = 'Mumble - Registrierung';
const passwordMismatchFeedback = 'Die Passwörter stimmen nicht überein.';
const thePassword = 'secretPa$$word';
const wrongPassword = 'secretPa$$word-2different';

const getPasswordFields = async (page: Page) => {
	// get form fields
	const passwordField = page.locator('input[name="password"]');

	const confirmPasswordField = page.locator('input[name="confirmPassword"]');
	await expect(passwordField).toBeVisible();
	await expect(confirmPasswordField).toBeVisible();

	// get aria-describedby linked text
	const confirmPasswordFieldAriaDescribedBy = await confirmPasswordField.getAttribute('aria-describedby');

	// get the user feedback element
	const confirmPasswordFieldUserFeedback = confirmPasswordFieldAriaDescribedBy
		? page.locator(`#${confirmPasswordFieldAriaDescribedBy}`)
		: null;

	return {
		passwordField,
		confirmPasswordField,
		confirmPasswordFieldUserFeedback,
	};
};

describe('Register Form works: if two different password strings are provided, there is a userFeedback and Submit Button is disabled', () => {
	test('Register Form is visible', async ({ page }) => {
		// load the register page
		await page.goto(signupUrl);
		// check if the Meta title is correct
		await expect(page).toHaveTitle(signupPageTitle);
		// check if userName field is visible
		await expect(page.getByLabel('Username')).toBeVisible();
	});

	test('Register Form is working when passwords are different and passwordMismatchFeedback appears', async ({ page }) => {
		// load the register page
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
});
