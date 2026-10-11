export type ThemeMode = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'pixima-site:theme';
const ORDER: ThemeMode[] = ['auto', 'light', 'dark'];

export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => 'auto');
  let query: MediaQueryList | undefined;

  function apply() {
    const prefersDark = query?.matches ?? false;
    const dark = mode.value === 'dark' || (mode.value === 'auto' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
  }

  function cycle() {
    mode.value = ORDER[(ORDER.indexOf(mode.value) + 1) % ORDER.length] ?? 'auto';
    try {
      localStorage.setItem(STORAGE_KEY, mode.value);
    } catch {
      return;
    } finally {
      apply();
    }
  }

  onMounted(() => {
    query = matchMedia('(prefers-color-scheme: dark)');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'auto') mode.value = saved;
    } catch {
      mode.value = 'auto';
    }
    apply();
    query.addEventListener('change', apply);
  });

  onBeforeUnmount(() => query?.removeEventListener('change', apply));

  return { mode, cycle };
}
