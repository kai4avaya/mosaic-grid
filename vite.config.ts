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
        outDir: resolve(__dirname, 'dist'), // Explicitly set output directory to root/dist
        emptyOutDir: true, // Clear dist folder before building
        lib: {
            entry: resolve(__dirname, 'src/mosaic-grid.ts'),
            name: 'MosaicGridWidget',
            fileName: 'mosaic-grid',
            formats: ['es', 'umd'] // Build both ES module and UMD formats
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
        // Use absolute path since root is 'demo'
        include: [resolve(__dirname, 'tests/**/*.{test,spec}.ts')],
    }
});
