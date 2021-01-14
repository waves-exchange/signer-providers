import * as path from 'path';
import { defineConfig, mergeConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import commonConfig from './vite.config';

export default mergeConfig(
    commonConfig,
    defineConfig({
        root: path.resolve(__dirname, 'src', 'iframe-entry'),
        build: {
            rollupOptions: {
                output: {
                    dir: 'iframe-entry/dist',
                    manualChunks: (id): string | undefined => {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                    },
                },
                external: ['node-fetch'],
            },
        },
        plugins: [legacy()]
    })
);
