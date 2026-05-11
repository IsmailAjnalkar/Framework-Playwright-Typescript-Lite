# Contributing

Thanks for your interest! This is the free **Lite** edition of the Playwright/TypeScript framework.

## Setup

```bash
git clone <repo-url>
cd Framework-Playwright-Typescript-Lite
npm install                 # downloads Playwright browsers via postinstall
cp .env.example .env        # Windows: copy .env.example .env
npm test
```

## Running tests

```bash
npm test                                  # everything
npm run test:ui | test:api                # a slice
npx playwright test src/tests/ui/login.spec.ts
npx playwright test src/tests/ui/login.spec.ts --grep "should log in successfully"
npm run test:chromium | test:chrome | test:firefox | test:webkit
npm run test:headed | test:headless | test:ui-mode | test:debug
npm run typecheck                         # tsc --noEmit
npm run report                            # open the HTML report
```

## Conventions

- Page objects extend `BasePage`; keep selectors in `src/pages/locators.ts`; expose pages from `PageFactory`.
- UI tests use the POM; API tests use the `apiClient` fixture from `src/utils/fixtures.ts`.
- Add reusable helpers to the relevant module in `src/utils/` and keep them typed.
- Don't commit `.env` or the report folders.

## PRs

1. Branch: `git checkout -b feature/<short-name>`
2. `npm run typecheck` and run the relevant tests.
3. Keep test titles descriptive.

For multi-environment config, auth/session reuse, Allure, Docker, a sharded CI pipeline, lint/format gates, and more, see the Pro Kit (link in the README).
