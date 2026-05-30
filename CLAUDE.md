# sdk-web — Lydian Checkout Web SDK

## Overview

Embeddable JavaScript checkout SDK for Lydian Pay. Ships as a single IIFE bundle
that merchants drop onto their site; it registers a `<lydian-checkout>` web
component and a global `window.Lydian` API, renders the payment UI in a shadow
DOM, and drives a crypto payment through to completion (wallet connect, QR,
status polling, KYC/Travel-Rule capture).

- **Package**: `@lydianpay/sdk-web` (public npm, scoped to `@lydianpay`)
- **Output**: `dist/lydian.iife.js` (committed/vendored; consumed via `<script>` or npm)
- **Language**: TypeScript (tsconfig `module: commonjs`, `target: ES2020`)
- **Bundler**: Vite 6 (library mode, IIFE, global name `Lydian`)
- **UI**: tsx-dom (`jsxFactory: h`) + Tailwind CSS (compiled to `lydian.generated.css`)
- **Wallets**: wagmi + viem + Reown AppKit/WalletKit (WalletConnect v2), MetaMask (EIP-6963)

## Quick Start

```bash
npm install
npm run dev      # Vite dev server (port 9999)
npm run build    # build:css + vite build -> dist/lydian.iife.js
npm test         # Vitest
```

## Architecture

```
Merchant page
  └─ <script src=".../lydian.iife.js">         # registers window.Lydian + <lydian-checkout>
       └─ <lydian-checkout>  (src/ui/Checkout.ts, shadow DOM)
            ├─ window.Lydian.init / updateTransaction        # public API (src/index.ts)
            ├─ wallet connect (WalletConnect v2 / MetaMask)  # src/services, src/integrations
            ├─ QR fallback                                   # qrcode
            └─ network layer  ──HTTP──>  Gateway (api.lydian.{dev|sandbox|com})
                 POST/GET/PATCH /transaction[...], POST /transaction/{id}/verification, GET /config
```

The SDK talks only to the Gateway REST API at `api.lydian.*`.

## Project Structure

```
src/
  index.ts                  # entry: registers <lydian-checkout> + window.Lydian
  constants.ts              # base URLs (api.lydian.*), asset catalog, status codes
  types.ts                  # request/response + GetSDKConfigResponse types
  network/
    base.ts                 # fetch wrapper; injects X-Publishable-Key header
    index.ts                # API mixin (Config + CryptoTransactions via applyMixins)
    config/                 # GET /config
    cryptotransaction/      # /transaction create/get/collect/cancel + KYC verification
    utils.ts                # applyMixins helper
  ui/
    Checkout.ts             # the web component: shadow DOM, payment flows, status polling
    checkout-template.html  # markup injected into the shadow root
    lydian.css              # Tailwind source -> lydian.generated.css (do not edit generated)
    buttons/*.tsx           # tsx-dom rendered asset/network/wallet buttons
  services/walletConnectService.ts   # WalletConnect v2 session lifecycle
  integrations/metamask.ts           # EIP-6963 provider discovery + signing
  types/                    # eip6963, ethereum, tether, usdc ambient typings
  assets.json               # token/network metadata
```

## Patterns

### Network layer
- All requests go through `Base` (`src/network/base.ts`): `request` (JSON, sets
  `Content-Type` + `X-Publishable-Key`) and `requestWithFormData` (multipart, no
  JSON content-type — the browser sets the boundary).
- Endpoints live in thin resource classes (`CryptoTransactions`, `Config`) mixed
  into one `API` object via `applyMixins`. Add a new endpoint as a method on the
  relevant class; keep the resource path as a `const resourceName`.
- Request/response **types are hand-maintained** in `types.ts` and must match the
  Gateway's Swagger contract. Drift is the main risk here — verify against
  gateway `docs/swagger.yaml` when changing a request shape (e.g. `documentFiles`
  is an array of files on `/transaction/{id}/verification`).

### Web component (`Checkout.ts`)
- Everything renders inside a **shadow DOM**; query nodes via `this.shadowRoot`.
- Status is **polled** with `setInterval(..., 2000)`. Every interval MUST be torn
  down through `clearInterval()` on success, failure, expiration, and teardown —
  leaking intervals is a recurring bug class. Track interval IDs on the instance.
- `init()` config is validated at the boundary; surface failures through the
  `paymentFailedListener` callback rather than throwing into the host page.

### Status codes (`constants.ts`)
`CryptoTransactionStatusPending = 0`, `...Success = 1`, `...PendingKYCVerification = -3`.

## Testing

**Vitest**, Node environment (uses global `fetch`/`FormData`/`File` — needs Node ≥ 20).

```bash
npm test
```

- `src/constants.test.ts` — guards base URLs (must be `api.lydian.*`).
- `src/network/cryptotransaction.test.ts` — mocks `fetch`; asserts routes/methods/
  headers and the multipart KYC `documentFiles` array contract.
- Mock `fetch` via `vi.fn`; instantiate resource classes directly
  (`new CryptoTransactions(baseUri, publishableKey)`). No DOM needed for the
  network layer. Add a regression test with any bug fix.

## Build & Publish

- `npm run build` runs `build:css` (Tailwind → `lydian.generated.css`) then
  `vite build`. `dist/lydian.iife.js` is committed and also vendored by consumers.
- `package.json` version is a permanent placeholder `0.0.0-managed` — **do not
  bump it**. The published version is taken from the GitHub Release tag in CI.
- **Publishing**: `.github/workflows/release-package.yml` publishes to public npm
  via OIDC trusted publishing (no token) on `release: published`. It stamps the
  version from the tag, runs `npm test`, builds, and `npm publish`es.
  `prepublishOnly` blocks publishing from a dev machine (CI-only).
- **Release ritual**: merge PR → create a GitHub Release tagged `vX.Y.Z`
  (target `main`) → CI publishes `X.Y.Z`.

## Security notes (public SDK loaded on third-party sites)

- This bundle executes on **merchant pages**. Treat DOM sinks carefully — avoid
  unsanitized `innerHTML`/`dangerouslySetInnerHTML` with non-static content.
- The `X-Publishable-Key` is publishable by design; never send or log secrets.
- Scrutinize new dependencies for bundle size and supply-chain risk — every byte
  ships to other people's sites.

## Supported assets / networks
Defined in `constants.ts` + `assets.json` (USDT, USDC, ETH, PYUSD, RLUSD, USDe,
USDS, USDP, DAI across Ethereum, Polygon, Arbitrum, Base, Optimism, Solana,
Bitcoin, Celo, Linea, Sonic, Unichain, ZKsync, …).
