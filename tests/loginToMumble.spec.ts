import { expect, test } from '@playwright/test';

test.describe('Login to Application, create a MumblePost, test its appearence and delete this post.', () => {
	const timelineUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
	const timelineTitle = 'Mumble - Welcome to Mumble';
	const loginUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/login`;

	test('Login to Mumble ', async ({ page }) => {
		// Generate a random text for the post
		const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)}`;

		// Step 1: Open the login page via the Mumble login button
		await page.goto(timelineUrl);
		await page.getByRole('button', { name: 'Login via Zitadel' }).click();

		// Check if we are on the zitadel login page
		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/login.*/);

		// Step 2: Fill in the username
		await page.fill('input[name="loginName"]', process.env.ZITADEL_USERNAME as string);
		await page.click('input[name="loginName"]');
		await page.keyboard.press('Enter');

		// Check if we are on the zitadel password page
		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/loginname.*/);

		// Step 3: Fill in the password
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		await page.click('input[name="password"]');
		await page.keyboard.press('Enter');

		// Check if we are redirected to mumble timeline
		await expect(page).toHaveURL(timelineUrl);
		await expect(page).toHaveTitle(timelineTitle);

		// Step 4: Write a mumble text and post it
		const postTextArea = page.getByPlaceholder('Deine Meinung zählt');
		await expect(postTextArea).toBeVisible();
		await postTextArea.fill(exampleText);
		const postBtn = page.getByText('Absenden', { exact: true });
		await postBtn.click();
		const postText = page.getByText(exampleText, { exact: true });
		await expect(postText).toBeVisible();

		// Step 5: Get element with class 'PostItem' that contains the text
		const postItem = page.locator(`.PostItem:has-text("${exampleText}")`);
		await expect(postItem).toBeVisible();

		// Step 6: Delete the exact PostItem again
		const deleteBtn = postItem.getByText('Delete', { exact: true });
		await deleteBtn.click();

		// Check if the post is gone from the timeline
		await expect(page.getByText(exampleText, { exact: true })).not.toBeVisible();

		// Step 7: Logout from mumble
		const logoutBtn = page.getByRole('button', { name: 'Log out' });
		await logoutBtn.click();

		// Check if we are redirected to the login url
		await expect(page).toHaveURL(loginUrl);
	});
});
