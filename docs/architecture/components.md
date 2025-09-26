# Components

## GIF Grid Component

**Responsibility:** Display GIFs in a responsive grid layout with infinite scrolling.

**Key Interfaces:**

- Props: `{ gifs: GIF[], onLoadMore: () => void, loading: boolean }`
- Renders individual GIF components
- Handles grid layout and responsive design

**Dependencies:** GIF Component, Infinite Scroll Hook

**Technology Stack:** React, TypeScript, CSS Grid, Tailwind CSS

## Infinite Scroll Hook

**Responsibility:** Manage infinite scrolling logic using Intersection Observer API.

**Key Interfaces:**

- Returns: `{ loadMore: () => void, isIntersecting: boolean }`
- Accepts callback for loading more content
- Manages intersection observer lifecycle

**Dependencies:** React Hooks, Intersection Observer API

**Technology Stack:** React Hooks, TypeScript, Browser APIs

## Tenor API Client

**Responsibility:** Handle all communication with Tenor API including error handling and rate limiting.

**Key Interfaces:**

- `searchGifs(query: string, limit: number, pos?: string): Promise<TenorResponse>`
- `handleRateLimit(): Promise<void>`
- `retryRequest(fn: Function, maxRetries: number): Promise<any>`

**Dependencies:** Fetch API, Error handling utilities

**Technology Stack:** TypeScript, Fetch API, Promise-based

## Full-Size Modal Component

**Responsibility:** Display GIFs in full size with close functionality.

**Key Interfaces:**

- Props: `{ gif: GIF, isOpen: boolean, onClose: () => void }`
- Handles keyboard navigation (Escape key)
- Manages focus trapping and accessibility

**Dependencies:** React Portal, Focus management

**Technology Stack:** React, TypeScript, CSS, Accessibility APIs
