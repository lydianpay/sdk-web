# TetherPayments Web SDK

A web SDK for TPG transactions

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

// Create a session with the session data returned from your server
const session = new TPG.Session({
    sessionUUID: "<UUID>",
    socketUrl: `http://us.examplechain.com`,
});

// Render the QR code to an element in the dom
// ex. <div id="tpg-payment-code"></div>
session.renderQrCode('tpg-payment-code');

// Start listening for customer interaction
session.listen({
    onConfirm(data) {
        // Customer confirmed transaction
    },
    onReject(data) {
        // Customer rejected the transaction
    },
    onError(error) {
        // Something went wrong :/
    },
});

// The session is automatically closed after recieving any event
// or after some timeout, ex. 15 minutes

// Manually close the socket (optional)
session.close();

```

## Usage w/ package import
```js
// Import 
import { Session } from '@tpg/js';

// OR require
const { Session } = require('@tpg/js');

// Create a session
const session = new Session({
    sessionUUID: "<UUID>",
    socketUrl: `http://us.examplechain.com`,
});

// Start listening for customer interaction
session.listen({ ... });
```