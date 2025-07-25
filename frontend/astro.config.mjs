import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(), 
    tailwind({
      configFile: './tailwind.config.mjs',
      applyBaseStyles: false,
    })
  ],
  server: {
    port: 4321
  }
});