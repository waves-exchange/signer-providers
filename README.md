# Signer providers monorepo
Providers for Signer. All in one repo

For better DX strongly recommended to use `npm@>=7`.
It can be installed via `npm i -g npm@7` and also it's built-in in node >=15 package.

Use `npm run dev` for development. (port is 3000 by default).

See packages/*/package.json `script` section for build, test, lint, etc.
For development `provider-ui-components` and `provider-cloud-auth` don't forget to use build watch mode.

## ProviderCloud

Testnet network by default. For mainnet use http://localhost:3000/?mainnet.

How to use https://github.com/waves-exchange/signer-providers/blob/main/packages/provider-cloud/README.md

## ProviderWeb

How to use https://github.com/waves-exchange/signer-providers/blob/main/packages/provider-web/README.md
