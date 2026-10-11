import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifestVersion: 3,
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: ({ browser }) => ({
    name: 'Pixima',
    description: 'Veja as imagens de qualquer página: copie, baixe e converta de formato.',
    permissions: ['scripting', 'downloads', 'activeTab'],
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
