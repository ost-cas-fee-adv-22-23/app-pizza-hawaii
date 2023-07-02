import { expect, Locator, Page, test } from '@playwright/test';

/**
 * Test Suite for Post Actions (Create, Comment, Like, Unlike, Delete)
 *
 * We test on the following pages:
 * 1. PostList Page (create a PostItem)
 * 2. PostDetail Page (comment on a PostItem)
 *
 * This test suite tests the following:
 * 1. Create a PostItem (Post or Comment)
 * 2. Like the PostItem
 * 3. Unlike the PostItem
 * 4. Delete the PostItem
 *
 * The tests are running serially because the order is important to have a Test-PostItem to like, unlike and delete.
 **/

['/', '/mumble/01GYX2NAVWCNCQNX7RV5SZARJK'].forEach((url) => {
	test.describe.serial('Create, Like, Unlike and Delete a Post at ' + url, () => {
		// Generate a random text for the post
		const exampleText = `Pizza Hawaii Test #pht #${Math.random().toString(36).substring(7)}`;

		let page: Page;
		let postItem: Locator;

		test.beforeAll(async ({ browser }) => {
			page = await browser.newPage();
			await page.goto(url);
		});

		test('Create Post at ' + url, async () => {
			// Step 1: Get PostCreator element
			const postCreator = page?.locator(`[data-testid="post-creator"]`);
			const postTextArea = postCreator?.locator(`textarea`);
			await expect(postTextArea).toBeVisible();

			// Step 2: Write a mumble text and post it
			await postTextArea.fill(exampleText);
			await expect(async () => {
				await postCreator?.locator(`[data-testid="submit-post"]`).click();
				await expect(postTextArea).toHaveText('');
			}).toPass();

			// Step 3: Check if the created post is visible
			await expect(async () => {
				postItem = page.locator(`[data-testid="post-item"]`, { hasText: exampleText });
				await expect(postItem).toBeVisible();
			}).toPass();
		});

		test('Like Post at ' + url, async () => {
			// Step 1: Get the like button and click it
			const likeButton = postItem?.locator(`[data-testid="like-button"]`);
			await likeButton.click();

			// Step 2: Check if the post is liked
			await expect(async () => {
				await expect(likeButton).toHaveAttribute('data-liked', 'true');
				await expect(likeButton).toHaveAttribute('data-likes', '1');
			}).toPass();
		});

		test('Unlike Post at ' + url, async () => {
			// Step 1: Get the like button and click it
			const likeButton = postItem?.locator(`[data-testid="like-button"]`);
			await likeButton.click();

			// Step 2: Check if the post is unliked
			await expect(async () => {
				await expect(likeButton).toHaveAttribute('data-liked', 'false');
				await expect(likeButton).toHaveAttribute('data-likes', '0');
			}).toPass();
		});

		test('Delete Post at ' + url, async () => {
			// Step 1: Get the delete button and click it
			await postItem?.locator(`[data-testid="delete-button"]`).click();

			// Step 2: Check if the post is not visible anymore
			await expect(async () => {
				await expect(postItem).toBeHidden();
			}).toPass();
		});
	});
});
