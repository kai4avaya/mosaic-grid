import { defineConfig } from 'vite';
import { resolve } from 'path';

// This combines your build and test configurations
export default defineConfig({
    // Serve the demo folder
    root: 'demo',
    
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        }
    },
    
    // 1. Configuration for 'npm run build'
    build: {
        lib: {
            entry: resolve(__dirname, 'src/mosaic-grid.ts'),
            name: 'MosaicGridWidget',
            fileName: 'mosaic-grid'
        },
        rollupOptions: {
            external: [],
        }
    },
    
    // 2. Configuration for 'npm test'
    test: {
        // This tells Vitest to load JSDOM (a virtual browser).
        environment: 'jsdom',
        
        // This makes 'document', 'HTMLElement', etc. globally available
        globals: true,
        
        // Tells Vitest where to find your test files
        include: ['tests/**/*.{test,spec}.ts'],
    }
});
