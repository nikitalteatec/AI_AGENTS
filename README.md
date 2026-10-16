# Playwright AI Agents – Test Automation

Playwright + TypeScript test framework (UI and API) with Jenkins CI.

## Prerequisites
- Node.js 20 or newer
- Git

## Setup
```bash
npm ci
npx playwright install --with-deps
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
```
Then edit `.env` with your own URLs and credentials. **Never commit `.env`.**

## Run tests
| Command | What it runs |
|---|---|
| `npm run test:e2e` | All tests |
| `npm run test:sanity` | Tests tagged `@sanity` |
| `npm run test:regression` | Tests tagged `@regression` |
| `npm run test:api` | Tests in `tests/api` |
| `npm run test:web` | Tests in `tests/web` |
| `npm run test:datadriven` | Tests tagged `@datadriven` |

Pick a browser or headed mode: `npm run test:sanity -- --project=firefox --headed`

## Reports
- HTML: `npm run report` (output in `reports/html`)
- JUnit XML: `reports/results.xml`
- Allure: `npm run allure:generate && npm run allure:open`

## CI
`Jenkinsfile` runs the pipeline with parameters for suite, browser and mode.
Replace the placeholder email addresses in the `emailext` block before use.
