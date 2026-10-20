# Unsplash Search API

A standalone NestJS backend for the Unsplash Search Photos API. No user authentication or database, as requested. Includes controller/service separation, DTO validation, configurable CORS, Helmet, throttling, Swagger, typed upstream responses, and error translation.

## Requirements
- Node.js 20+
- npm
- Unsplash Access Key: https://unsplash.com/developers

## Setup
```bash
npm install
```
Copy `.env.example` to `.env`, then set `UNSPLASH_ACCESS_KEY` to your real key. Start:
```bash
npm run start:dev
```
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`
- Health: `GET http://localhost:3000/api/health`

## Search endpoint
`GET /api/photos/search?query=nature&page=1&perPage=24&orientation=landscape&orderBy=relevant`

Parameters:
- `query` required, trimmed, 1–100 characters
- `page` optional integer >= 1, defaults to 1
- `perPage` optional integer 1–30, defaults to 24
- `orientation` optional: `landscape`, `portrait`, `squarish`
- `orderBy` optional: `relevant`, `latest`

Example:
```bash
curl --get 'http://localhost:3000/api/photos/search'   --data-urlencode 'query=nature'   --data-urlencode 'page=1'   --data-urlencode 'perPage=24'
```

## Connect the React frontend
Replace its direct Unsplash fetch with:
```ts
const params = new URLSearchParams({ query, page: '1', perPage: '24', orderBy: 'relevant' });
const response = await fetch(`http://localhost:3000/api/photos/search?${params}`);
if (!response.ok) throw new Error('Photo search failed');
const data = await response.json();
```
Remove `VITE_UNSPLASH_ACCESS_KEY` from the frontend; the key belongs only in the backend `.env`.

## Structure
```text
src/
├── health/health.controller.ts
├── health/health.module.ts
├── photos/
│   ├── dto/search-photos-query.dto.ts
│   ├── interfaces/unsplash-response.interface.ts
│   ├── photos.controller.ts
│   ├── photos.module.ts
│   └── photos.service.ts
├── app.module.ts
└── main.ts
```

## Engineering choices
- Feature modules and dependency injection
- Controller/service separation (HTTP concerns vs. integration logic)
- DTO transformation and strict validation
- Environment-driven configuration; no key in frontend code
- Timeout and upstream error mapping without leaking credentials
- Helmet security headers, restricted CORS, rate limiting
- Swagger/OpenAPI docs and health endpoint
- No database because this API proxies live Unsplash search results

## Quality checks
```bash
npm run typecheck
npm test
npm run build
```

The generated starter has not been installed or executed in this environment. The default NestJS test script expects spec files; add tests as the project grows.

## Production considerations
- The built-in throttler store is in-memory; use a shared store for multi-instance deployments.
- Set `FRONTEND_ORIGIN` to your actual deployed frontend origin(s).
- Use HTTPS and monitor Unsplash API usage. Follow Unsplash API requirements: https://unsplash.com/documentation and https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines
