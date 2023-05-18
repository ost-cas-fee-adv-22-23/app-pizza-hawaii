import { expect, test } from '@playwright/test';

test.describe('Login to mumble', () => {
	test('login to Mumble timeline ', async ({ page }) => {
		await page.goto(process.env.NEXT_PUBLIC_URL as string);
		await page.getByRole('button', { name: 'Login via Zitadel' }).click();
		await expect(page).toHaveURL(/.*.zitadel.cloud/);
		await page.fill('input[name="loginName"]', process.env.ZITADEL_USERNAME as string);
		const forwardBtn = page.getByText('next');
		await forwardBtn.click();
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		const forwardBtnLogin = page.getByText('next');
		await forwardBtnLogin.click();
		// redirect to mumble timeline
		await expect(page).toHaveURL('http://localhost:3000/');
		await expect(page).toHaveTitle('Mumble - Welcome to Mumble');

		// write a mumble text and post it
		const postTextArea = page.getByPlaceholder('Deine Meinung');
		await postTextArea.fill('Hello World - what a nice day to write End to End Tests!');
		const postBtn = page.getByRole('button', { name: 'Absenden' });
		await postBtn.click();

		// check if the post is in the timeline
		// TODO would be nice to refresh on the button click... but its appearence is too slow
		// await page.getByRole('button', { name: 'World is changing, update your feed.' }).waitFor();
		await page.goto(process.env.NEXT_PUBLIC_URL as string);

		await expect(page.getByText('what a nice day to write End to End Tests!')).toBeVisible();

		// now delete that post again
		const deleteBtn = page.getByRole('button', { name: 'Delete' });
		await deleteBtn.click();
		await expect(page).toHaveURL('http://localhost:3000/');
		await expect(page).toHaveTitle('Mumble - Welcome to Mumble');
		await expect(page.getByText('what a nice day to write End to End Tests!')).not.toBeVisible();
	});
});
