# Coding Standards

## Critical Fullstack Rules

- **Type Safety:** Always use TypeScript interfaces for API responses and component props
- **API Calls:** Never make direct fetch calls - use the tenorAPI service
- **Environment Variables:** Access only through process.env with NEXT*PUBLIC* prefix
- **Error Handling:** All API calls must use try-catch with user-friendly error messages
- **Component Structure:** Use functional components with TypeScript interfaces
- **Performance:** Implement lazy loading for all images and use React.memo for expensive components
- **Accessibility:** All interactive elements must have proper ARIA labels and keyboard navigation

## Naming Conventions

| Element          | Frontend             | Backend          | Example                     |
| ---------------- | -------------------- | ---------------- | --------------------------- |
| Components       | PascalCase           | -                | `GIFGrid.tsx`               |
| Hooks            | camelCase with 'use' | -                | `useInfiniteScroll.ts`      |
| API Routes       | -                    | kebab-case       | `/api/search-gifs`          |
| Database Tables  | -                    | snake_case       | `user_sessions`             |
| Types/Interfaces | PascalCase           | -                | `GIF`, `TenorResponse`      |
| Functions        | camelCase            | camelCase        | `searchGifs`, `handleError` |
| Constants        | UPPER_SNAKE_CASE     | UPPER_SNAKE_CASE | `API_BASE_URL`              |
