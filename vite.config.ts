import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// List of known large dependencies that should be in their own chunks
const LARGE_DEPS = new Set([
  'react',
  'react-dom',
  'lucide-react',
  'recharts',
  'react-beautiful-dnd',
  'html2canvas',
  'jspdf'
]);

// Common vendor chunks - only include dependencies that are actually installed
const vendorChunks = {
  'react-vendor': ['react', 'react-dom'],
  'chart-vendor': ['recharts'],
  'dnd-vendor': ['react-beautiful-dnd'],
  'pdf-vendor': ['html2canvas', 'jspdf'],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // Visualize bundle size
    ...(process.env.ANALYZE ? [visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })] : []),
  ],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      ...Object.values(vendorChunks).flat(),
      'react/jsx-runtime',
    ],
  },
  
  build: {
    chunkSizeWarningLimit: 1000, // Increased from default 500kb
    // Enable minification and source maps in production
    minify: 'esbuild',
    sourcemap: true,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable compression reporting
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Handle manual chunks first
          for (const [chunkName, deps] of Object.entries(vendorChunks)) {
            if (deps.some(dep => id.includes(`/node_modules/${dep}/`))) {
              return chunkName;
            }
          }
          
          // Handle large dependencies
          for (const dep of LARGE_DEPS) {
            if (id.includes(`/node_modules/${dep}/`)) {
              return `vendor-${dep.replace('@', '').replace(/[\W_]+/g, '-')}`;
            }
          }
          
          // Group by package
          const match = id.match(/[\\/]node_modules[\\/]([^\\/]+)/);
          if (match) {
            const packageName = match[1];
            // Group core-js and babel runtime together
            if (packageName.includes('core-js') || packageName.includes('@babel/runtime')) {
              return 'vendor-corejs';
            }
            // Group all other node_modules
            return `vendor-${packageName.replace('@', '')}`;
          }
          
          // Code-split components
          if (id.includes('src/components/')) {
            const component = id.split('/').pop()?.split('.')[0];
            if (component) {
              return `component-${component}`;
            }
          }
          
          // Code-split routes/pages if using React Router
          if (id.includes('src/pages/') || id.includes('src/routes/')) {
            const routeName = id.split('/').pop()?.split('.')[0];
            if (routeName) {
              return `route-${routeName}`;
            }
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  
  // Improve build performance
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    treeShaking: true,
  },
  
  // Improve development experience
  server: {
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    }
  }
});