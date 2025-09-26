# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**

- **Platform:** Vercel
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **CDN/Edge:** Vercel Edge Network

**Backend Deployment:**

- **Platform:** N/A (Frontend-only)
- **Build Command:** N/A
- **Deployment Method:** N/A

## CI/CD Pipeline

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## Environments

| Environment | Frontend URL                                    | Backend URL | Purpose           |
| ----------- | ----------------------------------------------- | ----------- | ----------------- |
| Development | http://localhost:3000                           | N/A         | Local development |
| Preview     | https://gachimuchi-gif-wall-git-main.vercel.app | N/A         | PR previews       |
| Production  | https://gachimuchi-gif-wall.vercel.app          | N/A         | Live environment  |
