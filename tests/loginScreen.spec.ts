import { expect, test } from '@playwright/test';

test('login screen appears', async ({ page }) => {
	await page.goto('http://localhost:3000/auth/login');
	// metaTite is the title of the page login
	await expect(page).toHaveTitle(/Login/);
});

/*
test('login screen: login with mailadress should fail and reports error console', async ({ page }) => {
	await page.goto('http://localhost:3000/auth/login');
	await page.getByLabel('email').fill('email.adress@mumble.com');
	await page.getByRole('button', { name: 'Login', exact: true }).click();
	await expect(page).toThrowError('Error: Function not yet implemented.');
});
*/

test('login with Zitadel shoud redirect to Zitadel url', async ({ page }) => {
	await page.goto('http://localhost:3000/auth/login');
	await page.getByRole('button', { name: 'Login via Zitadel' }).click();
	await expect(page).toHaveURL(/.*.zitadel.cloud/);
});

test('login screen: if clicked on the register link, we should redirected to the signup url', async ({ page }) => {
	await page.goto('http://localhost:3000/auth/login');
	// await expect(page).toHaveTitle(/Login/);
	await page.getByRole('link', { name: 'Jetzt Registrieren' }).click();
	// expect the url to contain signup
	await expect(page).toHaveURL(/.*signup/);
});
