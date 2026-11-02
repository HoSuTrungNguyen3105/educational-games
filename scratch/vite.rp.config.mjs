// Build riêng cho scratch/rp-entry.jsx (harness RangePagination) — không đụng
// vite.config.js của app:  <script> một file duy nhất để mở bằng trình duyệt.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'scratch/rp-out',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    reportCompressedSize: false,
    lib: {
      entry: 'scratch/rp-entry.jsx',
      name: 'RP',
      formats: ['iife'],
      fileName: () => 'rp.global.js',
    },
  },
});
