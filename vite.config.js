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
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libs
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
            return 'vendor';
          }
          
          // Split buyer screens into 3 sub-chunks
          if (id.includes('/screens/buyer/')) {
            // Core screens used most often
            if (id.match(/HomeScr|SearchScr|DetailScr|CartScr|CheckoutScr|ProfileScr|OrdersScr/)) {
              return 'buyer-core';
            }
            // Profile/settings related screens
            if (id.match(/PaymentHistory|Addresses|Loyalty|Subscriptions|Referral|GiftCard|Wishlist|NotifScr|PriceAlert|GroupBuy|ReturnScr|PromosScr|BecomeSeller|RoleReg|RegStatus|EditProfile|Recharge|Withdraw|Password|Language|Currency|MyStats/)) {
              return 'buyer-settings';
            }
            // Shopping features (live, group orders, chat etc.)
            if (id.match(/LiveWatch|GroupOrder|RateDriver|ChatBot|QRScan|ImageSearch|Gamification|Tracking|ChatScr|ChatList|ChatVendor|Vendor|RestoList|AllProducts|Categories|Flash|Nearby|Coupons|Reviews|Gallery|Compare/)) {
              return 'buyer-shopping';
            }
            return 'buyer-misc';
          }
          
          if (id.includes('/screens/vendor/')) return 'mode-vendor';
          if (id.includes('/screens/driver/')) return 'mode-driver';
          if (id.includes('/screens/common/')) return 'screens-common';
          if (id.includes('/modes/BuyerScreens')) return 'buyer-core';
          if (id.includes('/modes/VendorScreens')) return 'mode-vendor';
          if (id.includes('/modes/DriverScreens')) return 'mode-driver';
        }
      }
    }
  }
});
