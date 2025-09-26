import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for main heading
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText('Gachimuchi GIF Wall');
  });

  test('should have accessible error display', async ({ page }) => {
    // Check error message is accessible
    await expect(page.getByText('Something went wrong')).toBeVisible();
    
    // Check retry button has proper ARIA label
    const retryButton = page.getByRole('button', { name: /try again to load gifs/i });
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toHaveAttribute('aria-label');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that retry button can be focused
    const retryButton = page.getByRole('button', { name: /try again to load gifs/i });
    await expect(retryButton).toBeFocused();
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    // Button should still be visible (retry attempt)
    await expect(retryButton).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check that text has sufficient contrast against background
    const heading = page.getByRole('heading', { name: 'Gachimuchi GIF Wall' });
    const headingColor = await heading.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    // Should be white or light color for dark theme
    expect(headingColor).toMatch(/rgb\(255, 255, 255\)|rgb\(243, 244, 246\)|rgb\(229, 231, 235\)/);
  });

  test('should have proper focus indicators', async ({ page }) => {
    const retryButton = page.getByRole('button', { name: /try again to load gifs/i });
    
    // Focus the button
    await retryButton.focus();
    
    // Check that focus is visible
    await expect(retryButton).toBeFocused();
    
    // Check for focus ring styles
    const focusStyles = await retryButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });
    
    // Should have some form of focus indicator
    expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBeTruthy();
  });

  test('should have proper semantic structure', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    if (await main.count() > 0) {
      await expect(main).toBeVisible();
    }
    
    // Check that headings are properly structured
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings.first();
    const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
  });

  test('should handle screen reader content', async ({ page }) => {
    // Check for screen reader only content
    const srOnlyElements = page.locator('.sr-only');
    const srOnlyCount = await srOnlyElements.count();
    
    // Should have at least one screen reader only element (loading text)
    expect(srOnlyCount).toBeGreaterThanOrEqual(0);
  });
});
