import { expect, test } from '@playwright/test';

test.describe('Login to Application, create a MumblePost, test its appearence and delete this post.', () => {
	const timelineUrl = process.env.NEXT_PUBLIC_VERCEL_URL as string;
	const timelineTitle = 'Mumble - Welcome to Mumble';
	const loginUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/login`;

	test('Login to Mumble', async ({ page }) => {
		// Generate a random text for the post
		const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)}`;

		// Step 1: Open the login page via the Mumble login button
		await page.goto(timelineUrl);
		await page.getByRole('button', { name: 'Login via Zitadel' }).click();

		// Check if we are on the zitadel login page

		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/login.*/);

		// Step 2: Fill in the username
		await page.fill('input[name="loginName"]', process.env.ZITADEL_USERNAME as string);
		await page.keyboard.press('Enter');

		// Check if we are on the zitadel password page
		await expect(page).toHaveURL(/.*.zitadel.cloud\/ui\/login\/loginname.*/);

		// Step 3: Fill in the password
		await page.fill('input[name="password"]', process.env.ZITADEL_PASSWORD as string);
		await page.keyboard.press('Enter');

		// Check if we are redirected to mumble timeline
		await expect(page).toHaveURL(timelineUrl, { timeout: 10000 });
		await expect(page).toHaveTitle(timelineTitle);

		// Step 4: Write a mumble text and post it
		const postTextArea = page.getByPlaceholder('Deine Meinung zählt');
		await expect(postTextArea).toBeVisible();
		await postTextArea.fill(exampleText);

		const postButton = page.getByRole('button', { name: 'Absenden' });
		await postButton.isEnabled();
		await postButton.click();
		await expect(postTextArea).toHaveValue('');

		// Step 5.1: Get all elements with class 'PostItem' to have length > 0
		const postItems = await page.$$('.PostItem');
		await expect(postItems.length).toBeGreaterThan(0);

		// Step 5.2: Get element with class 'PostItem' that contains the text
		const postItem = page.locator(`.PostItem:has-text("${exampleText}")`);
		await postItem.isVisible();

		// Step 6: Delete the exact PostItem again
		await postItem.getByText('Delete', { exact: true }).click();
		await page.waitForTimeout(500);

		// Check if the post is gone from the timeline
		await expect(postItem).not.toBeVisible();

		// Step 7: Logout from mumble
		const logoutBtn = page.getByRole('button', { name: 'Log out' });
		await logoutBtn.click();

		// Check if we are redirected to the login url
		await expect(page).toHaveURL(loginUrl);
	});
});
