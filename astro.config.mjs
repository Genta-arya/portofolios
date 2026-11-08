import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// Otomatis gunakan adapter Vercel saat di-build di environment Vercel (CI/CD)
const isVercel = Boolean(process.env.VERCEL);

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.mgentaarya.my.id',
  output: 'server',
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', 'detect-gpu'],
    },
  },
});
