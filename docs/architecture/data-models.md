# Data Models

## GIF

**Purpose:** Represents a GIF from the Tenor API with all necessary display properties.

**Key Attributes:**

- id: string - Unique identifier from Tenor
- title: string - GIF title/description
- url: string - Direct GIF URL for display
- preview: string - Preview/thumbnail URL
- dimensions: { width: number, height: number } - GIF dimensions
- created: string - Creation timestamp

**TypeScript Interface:**

```typescript
interface GIF {
  id: string;
  title: string;
  url: string;
  preview: string;
  dimensions: {
    width: number;
    height: number;
  };
  created: string;
}
```

**Relationships:**

- Part of GIF collection/array
- Displayed in grid layout
- Clickable for full-size view

## Tenor API Response

**Purpose:** Type definition for Tenor API response structure.

**Key Attributes:**

- results: GIF[] - Array of GIF objects
- next: string - Pagination token for next page
- error: string - Error message if request fails

**TypeScript Interface:**

```typescript
interface TenorResponse {
  results: GIF[];
  next?: string;
  error?: string;
}
```

**Relationships:**

- Contains multiple GIF objects
- Used for pagination with next token
- Handles error states
