import { expect, test } from '@playwright/test';

test.describe('Login to Application, create a MumblePost, test its appearence and delete this post.', () => {
	const timelineUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
	const timelineTitle = 'Mumble - Welcome to Mumble';
	const logoutUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/login`;

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
		await page.keyboard.press('Enter');

		// fill in the password
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		await page.keyboard.press('Enter');

		// redirect to mumble timeline
		await expect(page).toHaveURL(timelineUrl);
		await expect(page).toHaveTitle(timelineTitle);

		// write a mumble text and post it
		const postTextArea = page.getByPlaceholder('Deine Meinung zählt');
		await expect(postTextArea).toBeVisible();
		await postTextArea.fill(exampleText);
		const postBtn = page.getByText('Absenden', { exact: true });
		await postBtn.click();
		const postText = page.getByText(exampleText, { exact: true });
		await expect(postText).toBeVisible();

		// get element with class 'PostItem' that contains the text
		const postItem = page.locator(`.PostItem:has-text("${exampleText}")`);
		await expect(postItem).toBeVisible();

		// now delete the exact PostItem again
		const deleteBtn = postItem.getByText('Delete', { exact: true });
		await deleteBtn.click();

		// check if the post is gone from the timeline
		await expect(page.getByText(exampleText, { exact: true })).not.toBeVisible();

		// logout from mumble
		const logoutBtn = page.getByRole('button', { name: 'Log out' });
		await logoutBtn.click();
		await expect(page).toHaveURL(logoutUrl);
	});
});
