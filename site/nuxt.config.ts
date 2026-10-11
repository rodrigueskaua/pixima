import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const themeScript =
  "(function(){try{var m=localStorage.getItem('pixima-site:theme');var d=m==='dark'||((m===null||m==='auto')&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  alias: {
    '@docs': fileURLToPath(new URL('../docs/screenshots', import.meta.url)),
  },
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: ['..'] } },
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/pixima/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#102a43' },
      ],
      script: [{ innerHTML: themeScript, tagPriority: 'critical' }],
    },
  },
  nitro: {
    preset: 'github_pages',
    prerender: { crawlLinks: true, autoSubfolderIndex: false, routes: ['/', '/privacidade'] },
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://rodrigueskaua.github.io/pixima',
    },
  },
});
