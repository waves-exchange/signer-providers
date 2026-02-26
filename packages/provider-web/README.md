# ProviderWeb
​
- [ProviderWeb](#providerweb)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
    - [1. Library installation](#1-library-installation)
    - [2. Library initialization](#2-library-initialization)
    - [3. Basic example](#3-basic-example)
  - [Constructor](#constructor)
  - [More examples](#more-examples)
​
<a id="overview"></a>
## Overview
​
ProviderWeb developed by Waves.Exchange implements a Signature Provider for [Signer](https://github.com/wavesplatform/signer) protocol library. Signer enables easy deploy dApps based on Waves blockchain. Users' encrypted private keys and SEED phrase are stored in wx.network domain of the local browser storage. WX.Network and other apps do not have access to the local data as they are stored encrypted.

​
> For now, signing is implemented for all types of transactions except exchange transactions.
​
<a id="getting-started"></a>
## Getting Started
​
### 1. Library installation
​
To install Signer and ProviderWeb libraries use
​
```bash
npm i @waves/signer @waves.exchange/provider-web
```
​
For Windows, use the following format:
```bash
npm i @waves/signer '@waves.exchange/provider-web'
```
​
​
### 2. Library initialization
​
Add library initialization to your app.
​
* For Testnet:
​
   ```js
   import Signer from '@waves/signer';
   import { ProviderWeb } from '@waves.exchange/provider-web';

   const signer = new Signer({
     // Specify URL of the node on Testnet
     NODE_URL: 'https://nodes-testnet.wavesnodes.com'
   });
   signer.setProvider(new ProviderWeb('https://testnet.wx.network/signer'));
   ```
​
* For Mainnet:
​
   ```js
   import Signer from '@waves/signer';
   import { ProviderWeb } from '@waves.exchange/provider-web';

   const signer = new Signer();
   signer.setProvider(new ProviderWeb());
   ```
​
### 3. Basic example
​
Now your application is ready to work with Waves Platform. Let's test it by implementing basic functionality. For example, we could try to authenticate user, get his/her balances and transfer funds.
​
```js
const user = await signer.login();
const balances = await signer.getBalance();
const [broadcastedTransfer] = await signer
  .transfer({amount: 100000000, recipient: 'alias:T:merry'}) // Transfer 1 WAVES to alias merry
  .broadcast(); // Promise will resolved after user sign and node response
​
const [signedTransfer] = await signer
  .transfer({amount: 100000000, recipient: 'alias:T:merry'}) // Transfer 1 WAVES to alias merry
  .sign(); // Promise will resolved after user sign
```

### 4. Sign order example

You can sign matcher orders using `signer.signOrder(...)`.
```js
const user = await signer.login();

const signedOrder = await signer.signOrder({
  amount: 100000000, // 1.0 amountAsset in minimal units
  amountAsset: null, // null = WAVES
  price: 105000000,
  priceAsset: 'REPLACE_WITH_PRICE_ASSET_ID',
  matcherPublicKey: 'REPLACE_WITH_MATCHER_PUBLIC_KEY',
  orderType: 'buy', // 'buy' or 'sell'
  matcherFee: 300000,
  senderPublicKey: user.publicKey,
  version: 4,
  priceMode: 'assetDecimals', // 'assetDecimals' or 'fixedDecimals'
  timestamp: Date.now(),
  expiration: Date.now() + 29 * 24 * 60 * 60 * 1000
});

console.log(signedOrder);
```

If needed, send signed order to your matcher API:

```js
await fetch('https://MATCHER_URL/matcher/orderbook', {
  method: 'POST',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(signedOrder)
});
```
​
<a id="constructor"></a>
## Constructor
​
```js
new ProviderWeb(clientOrigin: string, logs: boolean);
```
​
Creates an object that features user authentication and transaction signing.
​
You can use optional parameters for debugging.
​
| Parameter | Default value | Description |
| :--- | :--- | :--- |
| clientOrigin | https://wx.network/signer | URL of the ProviderWeb instance. For debugging, you can launch the ProviderWeb instance on your server. |
| logs | false | Logging level. If `true`, all events are logged |
​
**Usage:**
​
```js
var provider = new ProviderWeb(
  'http://localhost:8081/iframe-entry',
  true
);
```
​
<a id="More Examples"></a>
## More examples
​
Getting Started with Waves Signer and ProviderWeb: <https://medium.com/@izhur27/893017c9b7ae?>.
Collapse








