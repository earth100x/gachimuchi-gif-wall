# Frontend Architecture

## Component Architecture

### Component Organization

```
src/
├── components/
│   ├── GIFGrid/
│   │   ├── GIFGrid.tsx
│   │   ├── GIFGrid.module.css
│   │   └── index.ts
│   ├── GIFItem/
│   │   ├── GIFItem.tsx
│   │   ├── GIFItem.module.css
│   │   └── index.ts
│   ├── FullSizeModal/
│   │   ├── FullSizeModal.tsx
│   │   ├── FullSizeModal.module.css
│   │   └── index.ts
│   └── LoadingSpinner/
│       ├── LoadingSpinner.tsx
│       └── index.ts
├── hooks/
│   ├── useInfiniteScroll.ts
│   ├── useTenorAPI.ts
│   └── index.ts
├── services/
│   ├── tenorAPI.ts
│   └── index.ts
├── types/
│   ├── gif.ts
│   ├── tenor.ts
│   └── index.ts
└── utils/
    ├── errorHandler.ts
    └── index.ts
```

### Component Template

```typescript
import React from "react";
import { GIF } from "@/types";

interface GIFGridProps {
  gifs: GIF[];
  onLoadMore: () => void;
  loading: boolean;
}

export const GIFGrid: React.FC<GIFGridProps> = ({
  gifs,
  onLoadMore,
  loading,
}) => {
  return (
    <div className="gif-grid">
      {gifs.map((gif) => (
        <GIFItem key={gif.id} gif={gif} />
      ))}
      {loading && <LoadingSpinner />}
    </div>
  );
};
```

## State Management Architecture

### State Structure

```typescript
interface AppState {
  gifs: GIF[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextToken: string | null;
}

interface AppActions {
  setGifs: (gifs: GIF[]) => void;
  addGifs: (gifs: GIF[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setNextToken: (token: string | null) => void;
}
```

### State Management Patterns

- **useState for local component state**
- **useReducer for complex state logic**
- **Custom hooks for shared state logic**
- **Context API for global app state (if needed)**

## Routing Architecture

### Route Organization

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page (GIF wall)
├── loading.tsx        # Loading UI
├── error.tsx          # Error UI
└── not-found.tsx      # 404 page
```

### Protected Route Pattern

**N/A - No Authentication Required**

This application doesn't require protected routes as it's a public browsing experience.

## Frontend Services Layer

### API Client Setup

```typescript
class TenorAPIClient {
  private baseURL = "https://g.tenor.com/v1";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchGifs(
    query: string,
    limit: number = 8,
    pos?: string
  ): Promise<TenorResponse> {
    const params = new URLSearchParams({
      q: query,
      key: this.apiKey,
      limit: limit.toString(),
      ...(pos && { pos }),
    });

    const response = await fetch(`${this.baseURL}/search?${params}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }
}
```

### Service Example

```typescript
export const useTenorAPI = () => {
  const [gifs, setGifs] = useState<GIF[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGifs = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tenorAPI.searchGifs(query);
      setGifs(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { gifs, loading, error, searchGifs };
};
```
