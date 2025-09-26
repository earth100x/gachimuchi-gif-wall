# Unified Project Structure

```
gachimuchi-gif-wall/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── loading.tsx            # Loading UI
│   ├── error.tsx              # Error UI
│   └── not-found.tsx          # 404 page
├── src/                        # Source code
│   ├── components/            # React components
│   │   ├── GIFGrid/
│   │   ├── GIFItem/
│   │   ├── FullSizeModal/
│   │   └── LoadingSpinner/
│   ├── hooks/                 # Custom React hooks
│   │   ├── useInfiniteScroll.ts
│   │   └── useTenorAPI.ts
│   ├── services/              # API services
│   │   └── tenorAPI.ts
│   ├── types/                 # TypeScript types
│   │   ├── gif.ts
│   │   └── tenor.ts
│   └── utils/                 # Utility functions
│       └── errorHandler.ts
├── public/                     # Static assets
│   └── favicon.ico
├── docs/                       # Documentation
│   ├── prd.md
│   └── architecture.md
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── pnpm-lock.yaml              # pnpm lock file
├── pnpm-workspace.yaml         # pnpm workspace config
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```
