import { expect, test } from '@playwright/test';

test.describe('Login to Application, create a MumblePost, test its appearence and delete this post.', () => {
	const timelineUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
	const timelineTitle = 'Mumble - Welcome to Mumble';

	test('Login to Mumble ', async ({ page }) => {
		// generate a random text for the post
		const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)} (${new Date().getTime()})`;

		// open the login page
		await page.goto(timelineUrl);
		await page.getByRole('button', { name: 'Login via Zitadel' }).click();

		// check if we are on the zitadel login page
		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/login.*/);

		// fill in the username
		await page.fill('input[name="loginName"]', process.env.ZITADEL_USERNAME as string);
		const forwardBtn = page.getByText('next');
		await forwardBtn.click();

		// fill in the password
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		const forwardBtnLogin = page.getByText('next');
		await forwardBtnLogin.click();

		// redirect to mumble timeline
		await expect(page).toHaveURL(timelineUrl);
		await expect(page).toHaveTitle(timelineTitle);

		// write a mumble text and post it
		const postTextArea = page.getByPlaceholder('Deine Meinung zählt');
		await expect(postTextArea).toBeVisible();
		await postTextArea.fill(exampleText);
		const postBtn = page.getByText('Absenden');
		await postBtn.click();

		// check if the post is in the timeline
		// TODO would be nice to refresh on the button click... but its appearence is too slow
		// await page.getByRole('button', { name: 'World is changing, update your feed.' }).waitFor();

		await expect(page.getByText(exampleText)).toBeVisible();

		// now delete that post again
		const deleteBtn = page.getByRole('button', { name: 'Delete' });
		await deleteBtn.click();

		// wait 500ms
		await page.waitForTimeout(500);

		// check if the post is gone from the timeline
		await expect(page.getByText(exampleText)).not.toBeVisible();
	});
});
