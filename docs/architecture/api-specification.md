# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Gachimuchi GIF Wall API
  version: 1.0.0
  description: Client-side integration with Tenor API for GIF browsing
servers:
  - url: https://g.tenor.com/v1
    description: Tenor API server
paths:
  /search:
    get:
      summary: Search for GIFs
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
          description: Search query (gachimuchi)
        - name: key
          in: query
          required: true
          schema:
            type: string
          description: Tenor API key
        - name: limit
          in: query
          schema:
            type: integer
            default: 8
          description: Number of results to return
        - name: pos
          in: query
          schema:
            type: string
          description: Position for pagination
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TenorResponse"
        "400":
          description: Bad request
        "429":
          description: Rate limit exceeded
components:
  schemas:
    TenorResponse:
      type: object
      properties:
        results:
          type: array
          items:
            $ref: "#/components/schemas/GIF"
        next:
          type: string
        error:
          type: string
    GIF:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        url:
          type: string
        preview:
          type: string
        dimensions:
          type: object
          properties:
            width:
              type: number
            height:
              type: number
        created:
          type: string
```
