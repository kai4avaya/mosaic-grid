import { defineConfig } from 'vite';
import { resolve } from 'path';

// Configuration for building the demo for GitHub Pages
export default defineConfig({
    root: 'demo',
    
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        }
    },
    
    build: {
        outDir: resolve(__dirname, 'docs'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'demo/index.html'),
        },
    },
    
    base: '/mosaic-grid/', // Update this if your repo name is different
});
