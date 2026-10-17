import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { publicDelivery } from './vite-plugins/public-delivery';
export default defineConfig({
  appType: 'mpa',
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), publicDelivery()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { outDir: 'dist/public' },
  server: { host: '0.0.0.0', port: Number(process.env.PORT || 5173), allowedHosts: true },
});
