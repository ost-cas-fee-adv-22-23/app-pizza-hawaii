import { Locator, expect, test } from '@playwright/test';

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
	await expect(async () => {
		await page.getByTestId('submit-post').click();
		await expect(postTextArea).toHaveText('');
	}).toPass();

	// Step 2: Get element with class 'PostItem' that contains the text
	let postItem: Locator;
	await expect(async () => {
		postItem = await page.locator(`.PostItem`, { hasText: exampleText });
		await expect(postItem).toBeVisible();
	}).toPass();

	// Step 3: Delete the exact PostItem again
	await expect(async () => {
		await postItem?.locator(`[data-testid="delete-button"]`).click();
		await expect(postItem).not.toBeVisible();
	}).toPass();
});
