# Error Handling Strategy

## Error Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Service
    participant API

    User->>Component: Triggers action
    Component->>Service: API call
    Service->>API: HTTP request

    alt Success
        API-->>Service: Success response
        Service-->>Component: Parsed data
        Component-->>User: Display content
    else API Error
        API-->>Service: Error response
        Service->>Service: Parse error type
        Service-->>Component: Error object
        Component->>Component: Show error message
        Component-->>User: Display error UI
    else Network Error
        Service->>Service: Detect network failure
        Service-->>Component: Network error
        Component->>Component: Show offline message
        Component-->>User: Display offline UI
    end
```

## Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

## Frontend Error Handling

```typescript
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes("429")) {
      return "Too many requests. Please try again later.";
    }
    if (error.message.includes("500")) {
      return "Server error. Please try again.";
    }
    if (error.message.includes("Network")) {
      return "Network error. Please check your connection.";
    }
    return error.message;
  }
  return "An unexpected error occurred.";
};
```

## Backend Error Handling

**N/A - No Backend**
