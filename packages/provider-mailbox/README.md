# provider-mailbox

Signer wx.network mailbox auth provider
​
- [ProviderMailbox](#provider-mailbox)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
    - [1. Library installation](#1-library-installation)
    - [2. Library initialization](#2-library-initialization)
    - [3. Basic example](#3-basic-example)
​
<a id="overview"></a>
## Overview
​
ProviderMailbox developed by WX.Network implements a Signature Provider for [Signer](https://github.com/wavesplatform/signer) protocol library. Signer enables easy deploy dApps based on Waves blockchain. User's private key and SEED phrase are encrypted and stored in WX.Network, so your web app does not have access to them.
​
> For now, signing is implemented for all types of transactions except exchange transactions.
​
<a id="getting-started"></a>
## Getting Started
​
### 1. Library installation
​
To install Signer and ProviderMailbox libraries use
​
```bash
npm i @waves/signer @waves.exchange/provider-mailbox
```
​
For Windows, use the following format:
```bash
npm i @waves/signer '@waves.exchange/provider-mailbox'
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
   import { ProviderMailbox } from '@waves.exchange/provider-mailbox';

   const signer = new Signer({
     // Specify URL of the node on Testnet
     NODE_URL: 'https://nodes-testnet.wavesnodes.com'
   });
   signer.setProvider(new ProviderMailbox('https://testnet.wx.network/signer-mailbox'));
   ```
​
* For Mainnet:
​
   ```js
   import Signer from '@waves/signer';
   import { ProviderMailbox } from '@waves.exchange/provider-mailbox;

   const signer = new Signer();
   signer.setProvider(new ProviderMailbox());
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
​
