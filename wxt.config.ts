import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifestVersion: 3,
  zip: {
    excludeSources: ['site/**', 'docs/**'],
  },
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: ({ browser }) => ({
    name: 'Pixima',
    description: 'Todas as imagens de qualquer site num só painel. Copie, converta e baixe em ZIP em segundos, 100% privado.',
    permissions: ['scripting', 'downloads', ...(browser === 'firefox' ? ['activeTab'] : [])],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Abrir o Pixima',
    },
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'pixima@pixima.extension',
          data_collection_permissions: {
            required: ['none'],
          },
        },
      },
    }),
  }),
});
