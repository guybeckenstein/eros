import { URL, fileURLToPath } from 'node:url';

import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import netlify from '@netlify/vite-plugin-tanstack-start';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    netlify(),
    viteReact(),
    svgr(),
  ],
  ssr: {
    external: [
      '@tanstack/react-query',
      '@tanstack/react-form',
      '@headlessui/react',
      'framer-motion',
      '@mui/material',
      '@mui/utils',
      '@mui/system',
    ],
  },
});
