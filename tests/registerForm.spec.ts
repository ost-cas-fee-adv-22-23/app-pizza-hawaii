import { expect, Locator, Page, test } from '@playwright/test';

/**
 * RegisterForm Test Suite
 *
 * We test on the following pages:
 * 1. Register Page
 *
 * This test suite tests the following:
 * 1. All necessary fields are visible
 * 2. All fields show error message if empty
 * 3. Password validation shows error message if passwords are different
 * 4. Password validation hides error message if passwords are the same
 */

const signupUrl = `/auth/signup`;
const thePassword = 'secretPa$$word';
const wrongPassword = 'secretPa$$word-2different';

// HELPER FUNCTIONS
const getDescribeField = async (field: Locator, page: Page) => {
	// Get the aria-describedby attribute (id of the error message)
	const getAriaDescribedBy = await field?.getAttribute('aria-describedby');

	// Check if the aria-describedby attribute is set
	await expect(getAriaDescribedBy).not.toBeNull();

	// Get the error message
	return page.locator(`[id="${getAriaDescribedBy}"]`);
};

test.describe('Register Form', () => {
	let page: Page;
	const fieldNames = ['firstName', 'lastName', 'userName', 'email', 'password', 'confirmPassword'];

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto(signupUrl);
	});

	test('FormFields and SubmitButton are visible', async () => {
		// 1. Check if all fields are visible
		for (const fieldName of fieldNames) {
			const field = page.locator(`input[name="${fieldName}"]`);
			await expect(field).toBeVisible();
		}

		// 2. Check if the submit button is visible
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeVisible();
	});

	test('All fields show error message if empty', async () => {
		// 1. Click the submit button
		await page.locator('button[type="submit"]').click();

		// 2. Check if the aria-describedby attribute is set
		for (const fieldName of fieldNames) {
			const field = page.locator(`input[name="${fieldName}"]`);
			await expect(field).toBeVisible();

			const fieldDescription = await getDescribeField(field, page);

			// 3. Check if the error message is visible
			await expect(fieldDescription).toBeVisible();
			await expect(await fieldDescription?.innerText()).not.toBeNull();
		}
	});

	test('Password validation - different passwords', async () => {
		// 1. Test different passwords
		await page.fill('input[name="password"]', thePassword);
		await page.fill('input[name="confirmPassword"]', wrongPassword);

		await expect(async () => {
			const confirmPasswordField = await page?.locator(`input[name="confirmPassword"]`);
			const confirmPasswordDescription = await getDescribeField(confirmPasswordField, page);

			// 2. Check if the error message is visible
			await expect(confirmPasswordDescription).toBeVisible();
			await expect(await confirmPasswordDescription?.innerText()).not.toBeNull();
		}).toPass();
	});

	test('Password validation - same passwords', async () => {
		// 1. Test valid passwords
		await page.fill('input[name="password"]', thePassword);
		await page.fill('input[name="confirmPassword"]', thePassword);

		await expect(async () => {
			const confirmPasswordField = await page?.locator(`input[name="confirmPassword"]`);

			// 2. Check if the aria-describedby attribute is set
			const getAriaDescribedBy = await confirmPasswordField?.getAttribute('aria-describedby');
			await expect(getAriaDescribedBy).toBeNull();
		}).toPass();
	});
});
