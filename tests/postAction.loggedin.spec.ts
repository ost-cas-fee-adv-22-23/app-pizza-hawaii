import { expect, Locator, test } from '@playwright/test';

/**
 * This test suite tests the following:
 * 1. Create a post
 * 2. Like the post
 * 3. Unlike the post
 * 4. Delete the post
 *
 * The tests are running serially because the order is important to have a Test Post to like, unlike and delete.
 **/

test.describe.serial('Create, Like, Unlike and Delete a Post', () => {
	// Generate a random text for the post
	const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)}`;

	let page: Page;
	let postItem: Locator;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/');
	});

	test('Create Post', async () => {
		// Step 1: Get PostCreator element
		const postTextArea = page.locator('#post-creator');
		await expect(postTextArea).toBeVisible();

		// Step 2: Write a mumble text and post it
		await postTextArea.fill(exampleText);
		await expect(async () => {
			await page?.locator(`[data-testid="submit-post"]`).click();
			await expect(postTextArea).toHaveText('');
		}).toPass();

		// Step 3: Check if the created post is visible
		await expect(async () => {
			postItem = page.locator(`[data-testid="PostItem"]`, { hasText: exampleText });
			await expect(postItem).toBeVisible();
		}).toPass();
	});

	test('Like Post', async () => {
		// Step 1: Get the like button and click it
		const likeButton = postItem?.locator(`[data-testid="like-button"]`);
		await likeButton.click();

		// Step 2: Check if the post is liked
		await expect(async () => {
			await expect(likeButton).toHaveAttribute('data-liked', 'true');
			await expect(likeButton).toHaveAttribute('data-likes', '1');
		}).toPass();
	});

	test('Unlike Post', async () => {
		// Step 1: Get the like button and click it
		const likeButton = postItem?.locator(`[data-testid="like-button"]`);
		await likeButton.click();

		// Step 2: Check if the post is unliked
		await expect(async () => {
			await expect(likeButton).toHaveAttribute('data-liked', 'false');
			await expect(likeButton).toHaveAttribute('data-likes', '0');
		}).toPass();
	});

	test('Delete Post', async () => {
		// Step 1: Get the delete button and click it
		await postItem?.locator(`[data-testid="delete-button"]`).click();

		// Step 2: Check if the post is not visible anymore
		await expect(async () => {
			await expect(postItem).toBeHidden();
		}).toPass();
	});
});
