import { usePreferredDark, useStorage } from '@vueuse/core';
import { computed, watchEffect } from 'vue';

export type ThemeMode = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'pixima:theme';
const ORDER: ThemeMode[] = ['auto', 'light', 'dark'];

function applyClass(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

export function initTheme() {
  let mode: string | null = null;
  try {
    mode = localStorage.getItem(STORAGE_KEY);
  } catch {
    mode = null;
  }
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  applyClass(mode === 'dark' || (mode !== 'light' && systemDark));
}

export function useTheme() {
  const mode = useStorage<ThemeMode>(STORAGE_KEY, 'auto');
  const systemDark = usePreferredDark();
  const isDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && systemDark.value));

  watchEffect(() => applyClass(isDark.value));

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode.value) + 1) % ORDER.length];
    mode.value = next ?? 'auto';
  }

  return { mode, isDark, cycle };
}
