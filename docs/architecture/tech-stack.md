# Tech Stack

| Category             | Technology                   | Version | Purpose                              | Rationale                                              |
| -------------------- | ---------------------------- | ------- | ------------------------------------ | ------------------------------------------------------ |
| Frontend Language    | TypeScript                   | 5.9.2   | Type safety and developer experience | Compile-time error checking and better IDE support     |
| Frontend Framework   | Next.js                      | 15.1.8  | React framework with SSR/SSG         | Built-in optimizations, Vercel integration, App Router |
| UI Component Library | None                         | -       | Custom components                    | Simple app doesn't need external UI library            |
| State Management     | React Hooks                  | 19.1.1  | Local state management               | Built-in React state management sufficient             |
| API Style            | REST                         | -       | Tenor API integration                | Tenor provides REST API                                |
| Database             | None                         | -       | No data persistence                  | Client-side only application                           |
| Cache                | Browser Cache                | -       | HTTP caching                         | Leverage browser and Vercel edge caching               |
| File Storage         | None                         | -       | No file uploads                      | GIFs served from Tenor CDN                             |
| Authentication       | None                         | -       | No user accounts                     | Public browsing application                            |
| Frontend Testing     | Jest + React Testing Library | Latest  | Component and hook testing           | Industry standard for React testing                    |
| Backend Testing      | N/A                          | -       | No backend                           | Frontend-only application                              |
| E2E Testing          | Playwright                   | Latest  | End-to-end testing                   | Modern E2E testing framework                           |
| Build Tool           | Next.js                      | 15.1.8  | Built-in build system                | Next.js handles all build optimizations                |
| Bundler              | Webpack (via Next.js)        | -       | Module bundling                      | Next.js uses Webpack internally                        |
| IaC Tool             | Vercel CLI                   | Latest  | Infrastructure as code               | Vercel handles infrastructure                          |
| CI/CD                | GitHub Actions               | -       | Continuous integration               | Free CI/CD with GitHub integration                     |
| Monitoring           | Vercel Analytics             | -       | Performance monitoring               | Built-in Vercel analytics                              |
| Logging              | Console + Vercel             | -       | Application logging                  | Browser console and Vercel logs                        |
| CSS Framework        | Tailwind CSS                 | 4.0     | Utility-first CSS                    | Rapid development and consistent styling               |
