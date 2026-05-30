<h1 align="center">Lydian Checkout Web SDK</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@lydianpay/sdk-web"><img src="https://img.shields.io/npm/v/@lydianpay/sdk-web.svg" alt="npm version"></a>
  <a href="https://badge.socket.dev/npm/package/@lydianpay/sdk-web"><img src="https://badge.socket.dev/npm/package/@lydianpay/sdk-web" alt="Socket Badge"></a>
  <a href="https://qlty.sh/gh/lydianpay/projects/sdk-web"><img src="https://qlty.sh/gh/lydianpay/projects/sdk-web/maintainability.svg" alt="Maintainability"></a>
  <a href="https://qlty.sh/gh/lydianpay/projects/sdk-web"><img src="https://qlty.sh/gh/lydianpay/projects/sdk-web/coverage.svg" alt="Code Coverage"></a>
  <a href="https://github.com/lydianpay/sdk-web/actions/workflows/github-code-scanning/codeql"><img src="https://github.com/lydianpay/sdk-web/actions/workflows/github-code-scanning/codeql/badge.svg" alt="CodeQL"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

<p align="center">
  Accept crypto payments on your site with a drop-in checkout. The Lydian Web SDK
  registers a <code>&lt;lydian-checkout&gt;</code> web component and a global
  <code>window.Lydian</code> API that walks your customer through paying with a
  connected wallet or QR code across 20+ chains and major stablecoins.
</p>

## Installation

**npm**

```bash
npm install @lydianpay/sdk-web
```

```js
import '@lydianpay/sdk-web';
```

**Script tag (CDN)**

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@lydianpay/sdk-web@1.0.0/dist/lydian.iife.js"
></script>
```

Pin a version (e.g. `@1.0.0`) in production so an upstream release can't change
your checkout unexpectedly.

## Quick start

Place the checkout element where you want the UI, then initialize the SDK:

```html
<lydian-checkout></lydian-checkout>

<script type="module">
  window.Lydian.init({
    dev: false,
    sandbox: false, // both false → production
    publishableKey: 'pk_live_...',
    walletConnectProjectId: 'your-walletconnect-project-id',
    transaction: {
      amount: 2.45,
      currency: 'USD', // 'USD' or 'TRY'
      descriptor: 'Order #1234',
      referenceNumber: 'your-unique-ref',
    },
    paymentSuccessListener: () => {
      window.location.href = '/thank-you';
    },
    paymentFailedListener: (message) => {
      console.error('Payment failed:', message);
    },
    paymentCanceledListener: () => {
      console.log('Payment canceled');
    },
  });
</script>
```

## Configuration

`window.Lydian.init(options)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `publishableKey` | `string` | yes | Your Lydian publishable key (`pk_...`). |
| `walletConnectProjectId` | `string` | yes | Your [WalletConnect/Reown](https://dashboard.reown.com) project ID, used to power wallet connections. |
| `transaction` | `Transaction` | yes | The payment to collect (see below). |
| `dev` | `boolean` | yes | Target the dev environment. |
| `sandbox` | `boolean` | yes | Target sandbox. With both `dev` and `sandbox` `false`, the SDK uses production. |
| `paymentSuccessListener` | `() => void` | yes | Called when the payment completes. |
| `paymentFailedListener` | `(message: string) => void` | yes | Called on failure, with a message. |
| `paymentCanceledListener` | `() => void` | yes | Called when the customer cancels. |
| `isEmbedded` | `boolean` | no | Render the checkout inline (embedded) instead of as a modal. |

**`Transaction`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `number` | yes | Amount to charge. |
| `currency` | `'USD' \| 'TRY'` | yes | Fiat currency the amount is denominated in. |
| `referenceNumber` | `string` | yes | Your unique reference for this payment. |
| `descriptor` | `string` | no | Human-readable description shown to the customer. |

## Updating the transaction

Before the customer pays, you can update the amount or currency. This also
resets the checkout UI to its initial state:

```js
window.Lydian.updateTransaction({
  amount: 1.45,
  currency: 'USD',
  descriptor: 'Order #1234',
  referenceNumber: 'your-unique-ref',
});
```

## Environments

| Environment | Flags |
|-------------|-------|
| Production  | `dev: false, sandbox: false` |
| Sandbox     | `sandbox: true` |
| Development | `dev: true` |

## Supported assets & networks

USDT, USDC, ETH, PYUSD, RLUSD, USDe, USDS, USDP, DAI across Ethereum, Polygon,
Arbitrum, Base, Optimism, Solana, Bitcoin, Celo, Linea, Sonic, Unichain, ZKsync,
and more. Which assets appear at checkout is controlled by your Lydian account
configuration.

## Links

- [npm package](https://www.npmjs.com/package/@lydianpay/sdk-web)
- [Lydian developer docs](https://developer.lydian.com)

## License

[MIT](./LICENSE)
