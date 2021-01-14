import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
    plugins: [reactRefresh()],
    alias: {
        'node-fetch': '__browser-external',
    },
    optimizeDeps: {
        exclude: ['@waves/node-api-js'],
    },
});
