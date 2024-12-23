import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Optional: Adjust the base path if needed for deployment
  server: {
    open: true, // Opens the app in the browser on dev server start
  }
});
