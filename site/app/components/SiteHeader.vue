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
  { label: 'Privacidade', to: '/#privacidade' },
  { label: 'Perguntas', to: '/#perguntas' },
  { label: 'Instalar', to: '/#instalar' },
];
</script>

<template>
  <header class="border-border bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center gap-8 px-5">
      <NuxtLink to="/" class="flex items-center gap-2.5 font-semibold tracking-tight">
        <img :src="`${base}icon.png`" alt="" width="28" height="28" class="size-7 rounded-md">
        Pixima
      </NuxtLink>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Principal">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1">
        <a :href="links.repo" class="text-muted-foreground hover:text-foreground hidden px-3 py-2 text-sm sm:block">
          GitHub
        </a>
        <button
          type="button"
          class="text-muted-foreground hover:bg-muted hover:text-foreground grid size-9 place-items-center rounded-md transition-colors"
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
      </div>
    </div>
  </header>
</template>
