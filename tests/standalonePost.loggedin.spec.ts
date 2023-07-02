import { expect, test } from '@playwright/test';

/**
 * Test Suite for DetailView of a PostItem
 *
 * This test suite tests the following:
 * 1. Check PostItem Text
 * 2. Check PostItem User
 **/

const testPost = {
	url: `/mumble/01GYX2NAVWCNCQNX7RV5SZARJK`,
	text: 'Wo sind denn all die #hashtags hin?',
	userName: 'j.rudigier',
};

test.describe('DetailView of PostItem', () => {
	test('Check PostItem Text', async ({ page }) => {
		await page.goto(testPost.url);
		await expect(page.locator(`[data-testid="post-item"]`, { hasText: testPost.text })).toBeVisible();
	});

	test('Check PostItem User', async ({ page }) => {
		await page.goto(testPost.url);
		await expect(page.locator(`[data-testid="post-item"]`, { hasText: testPost.userName })).toBeVisible();
	});
});
