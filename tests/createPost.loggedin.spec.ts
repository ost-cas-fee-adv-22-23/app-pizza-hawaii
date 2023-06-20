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
	console.log(111111111, `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts`);
	const responsePromiseAdd = page.waitForResponse(
		(response) => response.url() === `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts` && response.status() === 201
	);
	await page.getByRole('button', { name: 'Absenden' }).click();
	await responsePromiseAdd;

	// Step 2: Get element with class 'PostItem' that contains the text
	const postItem = await page.locator(`.PostItem`, { hasText: exampleText });
	await expect(postItem).toBeVisible();

	// Step 3: Delete the exact PostItem again
	const responsePromiseDelete = page.waitForRequest(
		(request) =>
			request.url().includes(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/posts/`) && request.method() === 'DELETE'
	);
	await postItem.getByText('Delete').click();
	await responsePromiseDelete;

	// Check if the post is gone from the timeline
	await expect(postItem).not.toBeVisible();
});
