import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core: React + data (toujours chargé)
          'vendor-react': ['react', 'react-dom'],
          // Mode chunks (lazy loaded)
          'mode-buyer': [
            './src/modes/BuyerScreens.jsx',
            './src/screens/buyer/HomeScr.jsx',
            './src/screens/buyer/SearchScr.jsx',
            './src/screens/buyer/DetailScr.jsx',
            './src/screens/buyer/CartScr.jsx',
            './src/screens/buyer/CheckoutScr.jsx',
            './src/screens/buyer/ProfileScr.jsx',
          ],
          'mode-vendor': [
            './src/modes/VendorScreens.jsx',
          ],
          'mode-driver': [
            './src/modes/DriverScreens.jsx',
          ],
        }
      }
    }
  }
});
