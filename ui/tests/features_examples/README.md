# Feature Examples — learning specs for new Playwright APIs

One self-contained spec per feature, upgraded to **Playwright 1.64**. Every
file teaches ONE concept with "why it matters" comments and runnable evidence.

| File | Version | Teaches |
|---|---|---|
| `01_test_locks.spec.ts` | 1.63 | Named locks: shared-resource tests while others run parallel |
| `02_locator_composition.spec.ts` | 1.63+1.64 | `locator.within()` and `locator.visible()` |
| `03_page_storage.spec.ts` | 1.61 | `page.localStorage` / `page.sessionStorage` + demoblaze cookie session |
| `04_step_subtitle_params.spec.ts` | 1.63 | Structured `test.step` metadata (`subtitle`, `params`) in reports/traces |
| `05_abort_signal.spec.ts` | 1.62 | Cancelling stale actions/assertions with AbortSignal |
| `06_webp_screenshots.spec.ts` | 1.62 | WebP screenshots (standalone + baseline + config) |
| `authenticated/data_driven_cart.spec.ts` | patterns | storageState auth project + data-driven rows + locks |

Supporting framework upgrades in this repo:

- `ui/playwright.config.ts` — setup project + `chromium-authenticated`
  (storageState), `retryStrategy: 'isolated'`, `mergeFiles`, `screen` opt-out
- `ui/tests/auth/auth.setup.ts` — login once, assert `tokenp_` cookie, save state
- `ui/flows/ShoppingFlow.ts` — instance flow replacing 3 duplicated static dialog handlers
- `ui/helpers/fixtures/ActionFactoryFixture.ts` — now CHAINED over `SafeTestFixture`

## Run

```bash
# anonymous feature examples (chromium only)
npm run ui:learning          # or: cd ui && npx playwright test tests/features_examples --project=chromium

# authenticated examples (setup project runs first, providing the session)
cd ui && npx playwright test tests/features_examples/authenticated --project=chromium-authenticated

# deep-dive any example with a fresh trace
npx playwright test tests/features_examples/01_test_locks.spec.ts --trace on
```
