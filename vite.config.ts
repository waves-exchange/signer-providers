import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    plugins: [reactRefresh(), mkcert()],
    server: {
        port: 3000,
        https: true,
    },
    optimizeDeps: {
        include: [
            'buffer',
            '@waves/node-api-js/cjs/api-node/addresses',
            '@waves/node-api-js/cjs/api-node/alias',
            '@waves/node-api-js/cjs/api-node/assets',
            '@waves/node-api-js/cjs/api-node/transactions',
            '@waves/node-api-js/cjs/api-node/utils',
            '@waves/node-api-js/cjs/tools/adresses/availableSponsoredBalances',
            '@waves/node-api-js/cjs/tools/adresses/getAssetIdListByTx',
            '@waves/node-api-js/cjs/constants',
        ],
        exclude: ['node-fetch'],
    },
    build: {
        target: 'es2020',
        commonjsOptions: {
            ignore: ['node-fetch'],
        },
    },
});
