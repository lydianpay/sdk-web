# TetherPay Web SDK

A web SDK for Tether Pay transactions

## Setting started

Install packages

```
npm install
```

## Developing

Build the SDK in watch mode so code changes are reflected in dist

```
npm run dev
```

## Building

Build the sdk for release

```
npm run build
```

## Release

TODO: release to npm when ready to go live or begin testing

```
npm run release
```

## Usage w/ HTML script tag

```js
// Include script tag in your HTML document
<script src="http://cdn.tgp.com/js/tpg.min.js"></script>

// Include the checkout UI in your HTML document
<tetherpay-checkout></tetherpay-checkout>

// Initialize the SDK after placing the checkout UI
try {
    window.TetherPay.init({
        enableTetherPayAppPayment: false, // enable this to show the options to pay with tether pay app
        baseUri: 'YOUR_BASE_URL',
        publishableKey: 'YOUR_PUBLISHABLE_KEY',
        initialTransaction: {
            amount: 2.45, // Transaction amount to process payment
            currency: 'TRY', // Currency of the amount
            descriptor: 'YOUR_DESCRIPTOR',
            referenceNumber: 'YOUR_REFERENCE_NUMBER',
        },
        paymentFailedListener: (failureMessage) => { // This function is called whenever their is failure in processing payment
            alert(failureMessage);
        },
        paymentSuccessListener: () => { // This function is called when the payment succeeds
            alert("Payment Success!");
        }
    });
} catch (e) {
    console.error(e);
}

// At anytime before the user presses the pay button, the initial transaction can be updated using the following function. It also resets the UI back to initial state.
try {
    window.TetherPay.updateTransaction({
        amount: 1.45, // New transaction amount
        currency: "USD", // New currency or existing one for the provided amount
        descriptor: 'YOUR_DESCRIPTOR',
        referenceNumber: 'YOUR_REFERENCE_NUMBER',
    });
} catch (e) {
    console.error(e);
}
```
