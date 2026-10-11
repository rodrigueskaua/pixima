import { createApp } from 'vue';
import '@/assets/css/tailwind.css';
import 'vue-sonner/style.css';
import { initTheme } from '@/composables/useTheme';
import App from './App.vue';

initTheme();

createApp(App).mount('#app');
