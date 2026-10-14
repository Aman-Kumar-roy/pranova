import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/icons-material/Dashboard',
      '@mui/icons-material/Report',
      'react-admin',
    ],
  },
  server: {
    port: 5173,
    host: true,
  },
});
