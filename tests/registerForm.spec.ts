import { expect, test } from '@playwright/test';
import { describe } from 'node:test';

const appUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
const signupUrl = `${appUrl}/auth/signup`;
const signupPageTitle = 'Mumble - Registrierung';

describe('Register Form works: if two different password strings are provided, there is a userFeedback and Submit Button is disabled', () => {
	test('Register Form is visible', async ({ page }) => {
		// load the register page
		await page.goto(signupUrl);
		// check if the Meta title is correct
		await expect(page).toHaveTitle(signupPageTitle);
		// check if userName field is visible
		await expect(page.getByLabel('Username')).toBeVisible();
		// provide different passwords in password and repeat password field
		const passwordField = page.locator('input[name="password"]');
		const passwordRepeatField = page.locator('input[name="passwordRepeat"]');
		passwordField.fill('secretPa$$word');
		passwordRepeatField.fill('secretPa$$word-2different');
		// wait 100ms
		await page.waitForTimeout(100);
		expect(passwordRepeatField).toHaveAttribute('user-message', 'Die Passwörter stimmen nicht überein.');
		expect(page.getByRole('button', { name: 'Speichern' })).toBeDisabled();
	});

	test('Register Form is working when passwords are the same', async ({ page }) => {
		// load the register page
		await page.goto(signupUrl);
		// fill both password fields with the same password
		const passwordField = page.locator('input[name="password"]');
		const passwordRepeatField = page.locator('input[name="passwordRepeat"]');
		passwordRepeatField.fill('secretPa$$word');
		passwordField.fill('secretPa$$word');
		await page.waitForTimeout(100);
		// check if the submit button is enabled
		expect(page.getByRole('button', { name: 'Speichern' })).toBeEnabled();
	});
});
