import { expect, test } from '@playwright/test';

test('Create and delete Post', async ({ page }) => {
	// Generate a random text for the post
	const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)}`;

	// Step 0: Open page
	await page.goto('/');

	await page.waitForSelector('#post-creator');

	// Step 1: Write a mumble text and post it
	const postTextArea = page.locator('#post-creator');

	await expect(postTextArea).toBeVisible();
	await postTextArea.fill(exampleText);

	const postButton = page.getByRole('button', { name: 'Absenden' });
	await postButton.isEnabled();
	await postButton.click();

	// Step 2: Get element with class 'PostItem' that contains the text
	const postItem = page.locator(`.PostItem:has-text("${exampleText}")`);
	await expect(postItem).toBeVisible();

	// Step 3: Delete the exact PostItem again
	await postItem.getByText('Delete', { exact: true }).click();
	await page.waitForTimeout(500);

	// Check if the post is gone from the timeline
	await expect(postItem).not.toBeVisible();
});
