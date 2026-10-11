<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue';
import { links } from '~/data/content';

const base = useRuntimeConfig().app.baseURL;
const { mode, cycle } = useTheme();

const THEMES = {
  auto: { label: 'Tema: automático', icon: Monitor },
  light: { label: 'Tema: claro', icon: Sun },
  dark: { label: 'Tema: escuro', icon: Moon },
} as const;

const navigation = [
  { label: 'Recursos', to: '/#recursos' },
  { label: 'Como usar', to: '/#como-usar' },
  { label: 'Privacidade', to: '/#privacidade' },
  { label: 'Perguntas', to: '/#perguntas' },
];
</script>

<template>
  <header class="bg-header text-header-foreground sticky top-0 z-30 shadow-md">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5">
      <NuxtLink to="/" class="flex items-center gap-2.5 text-lg font-bold tracking-tight">
        <img :src="`${base}icon.png`" alt="" width="32" height="32" class="size-8 rounded-lg">
        Pixima
      </NuxtLink>

      <nav class="ml-auto hidden items-center gap-6 md:flex" aria-label="Principal">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg transition-colors hover:bg-white/10"
          :title="THEMES[mode].label"
          :aria-label="THEMES[mode].label"
          @click="cycle"
        >
          <ClientOnly>
            <component :is="THEMES[mode].icon" class="size-[18px]" />
            <template #fallback>
              <Monitor class="size-[18px]" />
            </template>
          </ClientOnly>
        </button>
        <a
          :href="links.install"
          class="bg-sun text-sun-foreground rounded-lg px-3.5 py-2 text-sm font-semibold transition hover:brightness-105"
        >
          Instalar
        </a>
      </div>
    </div>
  </header>
</template>
