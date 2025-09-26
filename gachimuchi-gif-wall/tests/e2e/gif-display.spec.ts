import { test, expect } from '@playwright/test';

test.describe('GIF Display Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Gachimuchi GIF Wall' })).toBeVisible();
    await expect(page.getByText('An infinite scrolling collection of GIFs powered by Tenor API')).toBeVisible();
  });

  test('should show error message when API key is not configured', async ({ page }) => {
    // Since we don't have a real API key in test environment, expect error state
    await expect(page.getByText('Something went wrong')).toBeVisible();
    await expect(page.getByText('Required environment variable NEXT_PUBLIC_TENOR_API_KEY is not set')).toBeVisible();
  });

  test('should have retry button in error state', async ({ page }) => {
    await expect(page.getByRole('button', { name: /try again to load gifs/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that the page still loads and shows error state
    await expect(page.getByRole('heading', { name: 'Gachimuchi GIF Wall' })).toBeVisible();
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check that the page still loads and shows error state
    await expect(page.getByRole('heading', { name: 'Gachimuchi GIF Wall' })).toBeVisible();
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Check that the page still loads and shows error state
    await expect(page.getByRole('heading', { name: 'Gachimuchi GIF Wall' })).toBeVisible();
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('should have proper dark theme styling', async ({ page }) => {
    // Check that the page has dark background
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(17, 24, 39)'); // gray-900
  });

  test('should have accessible retry button', async ({ page }) => {
    const retryButton = page.getByRole('button', { name: /try again to load gifs/i });
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toBeEnabled();
    
    // Test keyboard navigation
    await retryButton.focus();
    await expect(retryButton).toBeFocused();
  });
});

test.describe('GIF Grid Layout (with mock data)', () => {
  test('should display grid layout when GIFs are loaded', async ({ page }) => {
    // Mock the API response
    await page.route('**/g.tenor.com/v1/**', async route => {
      const mockResponse = {
        results: [
          {
            id: 'test-gif-1',
            title: 'Test GIF 1',
            url: 'https://example.com/test1.gif',
            preview: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=GIF1',
            dimensions: { width: 300, height: 200 },
            created: '2025-01-12T00:00:00Z'
          },
          {
            id: 'test-gif-2',
            title: 'Test GIF 2',
            url: 'https://example.com/test2.gif',
            preview: 'https://via.placeholder.com/400x300/00FF00/FFFFFF?text=GIF2',
            dimensions: { width: 400, height: 300 },
            created: '2025-01-12T00:00:00Z'
          }
        ],
        next: null
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    // Set a mock API key
    await page.addInitScript(() => {
      window.process = {
        ...window.process,
        env: {
          ...window.process?.env,
          NEXT_PUBLIC_TENOR_API_KEY: 'test-api-key'
        }
      };
    });

    await page.goto('/');
    
    // Wait for GIFs to load
    await page.waitForSelector('[alt="Test GIF 1"]', { timeout: 10000 });
    
    // Check that GIFs are displayed
    await expect(page.getByAltText('Test GIF 1')).toBeVisible();
    await expect(page.getByAltText('Test GIF 2')).toBeVisible();
    
    // Check grid layout
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
    await expect(gridContainer).toHaveClass(/grid-cols-2/);
  });

  test('should handle GIF click events', async ({ page }) => {
    // Mock the API response
    await page.route('**/g.tenor.com/v1/**', async route => {
      const mockResponse = {
        results: [
          {
            id: 'test-gif-1',
            title: 'Test GIF 1',
            url: 'https://example.com/test1.gif',
            preview: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=GIF1',
            dimensions: { width: 300, height: 200 },
            created: '2025-01-12T00:00:00Z'
          }
        ],
        next: null
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    // Set a mock API key
    await page.addInitScript(() => {
      window.process = {
        ...window.process,
        env: {
          ...window.process?.env,
          NEXT_PUBLIC_TENOR_API_KEY: 'test-api-key'
        }
      };
    });

    await page.goto('/');
    
    // Wait for GIF to load
    await page.waitForSelector('[alt="Test GIF 1"]', { timeout: 10000 });
    
    // Listen for console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Click on the GIF
    await page.getByAltText('Test GIF 1').click();
    
    // Check that click was logged
    await expect.poll(() => consoleLogs).toContain('GIF clicked:');
  });
});
