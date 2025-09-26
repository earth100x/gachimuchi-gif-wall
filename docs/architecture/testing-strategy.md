# Testing Strategy

## Testing Pyramid

```
E2E Tests (Playwright)
/        \
Integration Tests (React Testing Library)
/            \
Unit Tests (Jest)
```

## Test Organization

### Frontend Tests

```
src/
├── __tests__/
│   ├── components/
│   │   ├── GIFGrid.test.tsx
│   │   ├── GIFItem.test.tsx
│   │   └── FullSizeModal.test.tsx
│   ├── hooks/
│   │   ├── useInfiniteScroll.test.ts
│   │   └── useTenorAPI.test.ts
│   └── services/
│       └── tenorAPI.test.ts
├── __mocks__/
│   └── tenorAPI.ts
└── test-utils/
    └── render.tsx
```

### Backend Tests

**N/A - No Backend**

### E2E Tests

```
e2e/
├── gif-browsing.spec.ts
├── infinite-scroll.spec.ts
├── error-handling.spec.ts
└── accessibility.spec.ts
```

## Test Examples

### Frontend Component Test

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { GIFGrid } from "@/components/GIFGrid";
import { mockGIFs } from "@/__mocks__/gifData";

describe("GIFGrid", () => {
  it("renders GIFs in grid layout", () => {
    const onLoadMore = jest.fn();
    render(<GIFGrid gifs={mockGIFs} onLoadMore={onLoadMore} loading={false} />);

    expect(screen.getAllByRole("img")).toHaveLength(mockGIFs.length);
  });

  it("calls onLoadMore when loading more button is clicked", () => {
    const onLoadMore = jest.fn();
    render(<GIFGrid gifs={mockGIFs} onLoadMore={onLoadMore} loading={false} />);

    fireEvent.click(screen.getByText("Load More"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
```

### Backend API Test

**N/A - No Backend**

### E2E Test

```typescript
import { test, expect } from "@playwright/test";

test("user can browse GIFs with infinite scroll", async ({ page }) => {
  await page.goto("/");

  // Wait for initial GIFs to load
  await expect(page.locator('[data-testid="gif-item"]')).toHaveCount(8);

  // Scroll to bottom to trigger infinite scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for more GIFs to load
  await expect(page.locator('[data-testid="gif-item"]')).toHaveCount(16);
});
```
