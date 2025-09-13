// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { splitVendorChunkPlugin } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { visualizer } from "file:///home/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var LARGE_DEPS = /* @__PURE__ */ new Set([
  "react",
  "react-dom",
  "date-fns",
  "lucide-react",
  "@radix-ui",
  "framer-motion",
  "react-router-dom",
  "react-query",
  "zod",
  "react-hook-form",
  "@tanstack/react-query"
]);
var vendorChunks = {
  "react-vendor": ["react", "react-dom", "react-router-dom"],
  "ui-vendor": [
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-tabs",
    "@radix-ui/react-slot",
    "@radix-ui/react-avatar"
  ],
  "utils-vendor": ["date-fns", "zod", "react-hook-form", "class-variance-authority", "clsx", "tailwind-merge"],
  "state-vendor": ["@tanstack/react-query", "react-query"]
};
var vite_config_default = defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // Visualize bundle size
    ...process.env.ANALYZE ? [visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    })] : []
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      ...Object.values(vendorChunks).flat(),
      "react/jsx-runtime",
      "scheduler/tracing"
    ]
  },
  build: {
    chunkSizeWarningLimit: 1e3,
    // Increased from default 500kb
    // Enable minification and source maps in production
    minify: "esbuild",
    sourcemap: true,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable compression reporting
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          for (const [chunkName, deps] of Object.entries(vendorChunks)) {
            if (deps.some((dep) => id.includes(`/node_modules/${dep}/`))) {
              return chunkName;
            }
          }
          for (const dep of LARGE_DEPS) {
            if (id.includes(`/node_modules/${dep}/`)) {
              return `vendor-${dep.replace("@", "").replace(/[\W_]+/g, "-")}`;
            }
          }
          const match = id.match(/[\\/]node_modules[\\/]([^\\/]+)/);
          if (match) {
            const packageName = match[1];
            if (packageName.includes("core-js") || packageName.includes("@babel/runtime")) {
              return "vendor-corejs";
            }
            return `vendor-${packageName.replace("@", "")}`;
          }
          if (id.includes("src/components/")) {
            const component = id.split("/").pop()?.split(".")[0];
            if (component) {
              return `component-${component}`;
            }
          }
          if (id.includes("src/pages/") || id.includes("src/routes/")) {
            const routeName = id.split("/").pop()?.split(".")[0];
            if (routeName) {
              return `route-${routeName}`;
            }
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  },
  // Improve build performance
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    treeShaking: true
  },
  // Improve development experience
  server: {
    fs: {
      // Allow serving files from one level up from the package root
      allow: [".."]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcblxuLy8gTGlzdCBvZiBrbm93biBsYXJnZSBkZXBlbmRlbmNpZXMgdGhhdCBzaG91bGQgYmUgaW4gdGhlaXIgb3duIGNodW5rc1xuY29uc3QgTEFSR0VfREVQUyA9IG5ldyBTZXQoW1xuICAncmVhY3QnLFxuICAncmVhY3QtZG9tJyxcbiAgJ2RhdGUtZm5zJyxcbiAgJ2x1Y2lkZS1yZWFjdCcsXG4gICdAcmFkaXgtdWknLFxuICAnZnJhbWVyLW1vdGlvbicsXG4gICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgJ3JlYWN0LXF1ZXJ5JyxcbiAgJ3pvZCcsXG4gICdyZWFjdC1ob29rLWZvcm0nLFxuICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuXSk7XG5cbi8vIENvbW1vbiB2ZW5kb3IgY2h1bmtzXG5jb25zdCB2ZW5kb3JDaHVua3MgPSB7XG4gICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICd1aS12ZW5kb3InOiBbXG4gICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxuICAgICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXG4gICAgJ0ByYWRpeC11aS9yZWFjdC10YWJzJyxcbiAgICAnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLFxuICAgICdAcmFkaXgtdWkvcmVhY3QtYXZhdGFyJyxcbiAgXSxcbiAgJ3V0aWxzLXZlbmRvcic6IFsnZGF0ZS1mbnMnLCAnem9kJywgJ3JlYWN0LWhvb2stZm9ybScsICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknLCAnY2xzeCcsICd0YWlsd2luZC1tZXJnZSddLFxuICAnc3RhdGUtdmVuZG9yJzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknLCAncmVhY3QtcXVlcnknXSxcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksXG4gICAgLy8gVmlzdWFsaXplIGJ1bmRsZSBzaXplXG4gICAgLi4uKHByb2Nlc3MuZW52LkFOQUxZWkUgPyBbdmlzdWFsaXplcih7XG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgIH0pXSA6IFtdKSxcbiAgXSxcbiAgXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgaW5jbHVkZTogW1xuICAgICAgLi4uT2JqZWN0LnZhbHVlcyh2ZW5kb3JDaHVua3MpLmZsYXQoKSxcbiAgICAgICdyZWFjdC9qc3gtcnVudGltZScsXG4gICAgICAnc2NoZWR1bGVyL3RyYWNpbmcnLFxuICAgIF0sXG4gIH0sXG4gIFxuICBidWlsZDoge1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCwgLy8gSW5jcmVhc2VkIGZyb20gZGVmYXVsdCA1MDBrYlxuICAgIC8vIEVuYWJsZSBtaW5pZmljYXRpb24gYW5kIHNvdXJjZSBtYXBzIGluIHByb2R1Y3Rpb25cbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgLy8gRW5hYmxlIENTUyBjb2RlIHNwbGl0dGluZ1xuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAvLyBFbmFibGUgY29tcHJlc3Npb24gcmVwb3J0aW5nXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBIYW5kbGUgbWFudWFsIGNodW5rcyBmaXJzdFxuICAgICAgICAgIGZvciAoY29uc3QgW2NodW5rTmFtZSwgZGVwc10gb2YgT2JqZWN0LmVudHJpZXModmVuZG9yQ2h1bmtzKSkge1xuICAgICAgICAgICAgaWYgKGRlcHMuc29tZShkZXAgPT4gaWQuaW5jbHVkZXMoYC9ub2RlX21vZHVsZXMvJHtkZXB9L2ApKSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2h1bmtOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBIYW5kbGUgbGFyZ2UgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgZm9yIChjb25zdCBkZXAgb2YgTEFSR0VfREVQUykge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKGAvbm9kZV9tb2R1bGVzLyR7ZGVwfS9gKSkge1xuICAgICAgICAgICAgICByZXR1cm4gYHZlbmRvci0ke2RlcC5yZXBsYWNlKCdAJywgJycpLnJlcGxhY2UoL1tcXFdfXSsvZywgJy0nKX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBHcm91cCBieSBwYWNrYWdlXG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBpZC5tYXRjaCgvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL10oW15cXFxcL10rKS8pO1xuICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIC8vIEdyb3VwIGNvcmUtanMgYW5kIGJhYmVsIHJ1bnRpbWUgdG9nZXRoZXJcbiAgICAgICAgICAgIGlmIChwYWNrYWdlTmFtZS5pbmNsdWRlcygnY29yZS1qcycpIHx8IHBhY2thZ2VOYW1lLmluY2x1ZGVzKCdAYmFiZWwvcnVudGltZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLWNvcmVqcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHcm91cCBhbGwgb3RoZXIgbm9kZV9tb2R1bGVzXG4gICAgICAgICAgICByZXR1cm4gYHZlbmRvci0ke3BhY2thZ2VOYW1lLnJlcGxhY2UoJ0AnLCAnJyl9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ29kZS1zcGxpdCBjb21wb25lbnRzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdzcmMvY29tcG9uZW50cy8nKSkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gaWQuc3BsaXQoJy8nKS5wb3AoKT8uc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGBjb21wb25lbnQtJHtjb21wb25lbnR9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ29kZS1zcGxpdCByb3V0ZXMvcGFnZXMgaWYgdXNpbmcgUmVhY3QgUm91dGVyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdzcmMvcGFnZXMvJykgfHwgaWQuaW5jbHVkZXMoJ3NyYy9yb3V0ZXMvJykpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlTmFtZSA9IGlkLnNwbGl0KCcvJykucG9wKCk/LnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBpZiAocm91dGVOYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBgcm91dGUtJHtyb3V0ZU5hbWV9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIFxuICAvLyBJbXByb3ZlIGJ1aWxkIHBlcmZvcm1hbmNlXG4gIGVzYnVpbGQ6IHtcbiAgICBsb2dPdmVycmlkZTogeyAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCcgfSxcbiAgICB0cmVlU2hha2luZzogdHJ1ZSxcbiAgfSxcbiAgXG4gIC8vIEltcHJvdmUgZGV2ZWxvcG1lbnQgZXhwZXJpZW5jZVxuICBzZXJ2ZXI6IHtcbiAgICBmczoge1xuICAgICAgLy8gQWxsb3cgc2VydmluZyBmaWxlcyBmcm9tIG9uZSBsZXZlbCB1cCBmcm9tIHRoZSBwYWNrYWdlIHJvb3RcbiAgICAgIGFsbG93OiBbJy4uJ11cbiAgICB9XG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsOEJBQThCO0FBQ3ZDLFNBQVMsa0JBQWtCO0FBRzNCLElBQU0sYUFBYSxvQkFBSSxJQUFJO0FBQUEsRUFDekI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVB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
