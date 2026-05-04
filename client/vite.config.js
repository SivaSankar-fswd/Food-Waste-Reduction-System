import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000/api';
  const target = apiUrl.replace('/api', '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.png', 'logo192.png', 'logo512.png', 'robots.txt'],
        manifest: {
          name: 'Food Waste Reduction - Donate & Receive',
          short_name: 'FoodDonate',
          description: 'A platform to donate and receive food to reduce waste and help the community.',
          theme_color: '#4CAF50',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'logo.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'logo192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'logo512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'logo512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
        }
      }
    }
  }
})