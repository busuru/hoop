import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
      overlay: false
    },
    fs: {
      allow: ['..']
    },
    watch: {
      usePolling: true
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime.js': 'react/jsx-runtime.js'
    }
  },
  
  define: {
    'process.env': {}
  },
  
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: /node_modules/
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', '@emotion/react'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@emotion/react'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
});