# provider-cloud

Signer waves.exchange cloud auth provider
​
- [ProviderCloud](#provider-cloud)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
    - [1. Library installation](#1-library-installation)
    - [2. Library initialization](#2-library-initialization)
    - [3. Basic example](#3-basic-example)
​
<a id="overview"></a>
## Overview
​
ProviderCloud developed by Waves.Exchange implements a Signature Provider for [Signer](https://github.com/wavesplatform/signer) protocol library. Signer enables easy deploy dApps based on Waves blockchain. User's private key and SEED phrase are encrypted and stored in Waves.Exchange, so your web app does not have access to them.
​
> For now, signing is implemented for all types of transactions except exchange transactions.
​
<a id="getting-started"></a>
## Getting Started
​
### 1. Library installation
​
To install Signer and ProviderCloud libraries use
​
```bash
npm i @waves/signer @waves.exchange/provider-cloud
```
​
For Windows, use the following format:
```bash
npm i @waves/signer '@waves.exchange/provider-cloud'
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
   import { ProviderCloud } from '@waves.exchange/provider-cloud';

   const signer = new Signer({
     // Specify URL of the node on Testnet
     NODE_URL: 'https://nodes-testnet.wavesnodes.com'
   });
   signer.setProvider(new ProviderCloud('https://testnet.wx.network/signer-cloud'));
   ```
​
* For Mainnet:
​
   ```js
   import Signer from '@waves/signer';
   import { ProviderCloud } from '@waves.exchange/provider-cloud';

   const signer = new Signer();
   signer.setProvider(new ProviderCloud());
   ```
​
* For tetsnetwxnetwork env:
  ​
   ```js
   import { ProviderCloud } from '@waves.exchange/provider-cloud';

   const provider = new ProviderCloud('https://testnet.wx.network/signer-cloud?env=testnetwxnetwork');
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
