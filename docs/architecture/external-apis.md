# External APIs

## Tenor API

- **Purpose:** Source of GIF content for the application
- **Documentation:** https://developers.google.com/tenor
- **Base URL(s):** https://g.tenor.com/v1
- **Authentication:** API key in query parameters
- **Rate Limits:** 1000 requests per day (free tier)

**Key Endpoints Used:**

- `GET /search` - Search for GIFs with query "gachimuchi"

**Integration Notes:**

- CORS enabled for browser requests
- Rate limiting handled with exponential backoff
- Error handling for network failures and API errors
- Pagination support for infinite scrolling
