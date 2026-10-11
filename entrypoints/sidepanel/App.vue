<script setup lang="ts">
import {
  CircleHelp,
  Crosshair,
  Download,
  Globe,
  ImageOff,
  LayoutGrid,
  List,
  LoaderCircle,
  Monitor,
  Moon,
  RefreshCw,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sun,
  X,
} from '@lucide/vue';
import { useStorage } from '@vueuse/core';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { browser } from 'wxt/browser';
import ExportSheet from '@/components/ExportSheet.vue';
import FilterSheet from '@/components/FilterSheet.vue';
import type { Orientation, SortMode } from '@/components/FilterSheet.vue';
import ImageCard from '@/components/ImageCard.vue';
import PreviewDialog from '@/components/PreviewDialog.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { useImageActions } from '@/composables/useImageActions';
import { useImagePicker } from '@/composables/useImagePicker';
import { usePageImages } from '@/composables/usePageImages';
import { useTheme } from '@/composables/useTheme';
import { useTour } from '@/composables/useTour';
import { cn } from '@/lib/utils';
import type { ImageKind, NamingMode, OutputFormat, ScannedImage } from '@/shared/types';
import { baseName, formatOf, guessExtension } from '@/utils/images';
import { effectiveKind, groupVariants, isTracker } from '@/utils/variants';

type KindFilter = ImageKind | 'all';

const KIND_LABELS: Record<ImageKind, string> = {
  img: 'Imagens',
  background: 'Fundos',
  svg: 'SVG',
  canvas: 'Canvas',
  icon: 'Ícones',
  meta: 'Capas',
  poster: 'Vídeos',
};

const KIND_BADGES: Record<ImageKind, string> = {
  img: 'img',
  background: 'css',
  svg: 'svg',
  canvas: 'png',
  icon: 'ícone',
  meta: 'capa',
  poster: 'vídeo',
};

const FORMAT_LABELS: Record<OutputFormat, string> = {
  original: 'Formato original',
  png: 'PNG',
  jpeg: 'JPG',
  webp: 'WebP',
};

const SIZE_STEPS = [0, 32, 64, 100, 200, 300, 500, 800, 1200, 2000];
const DEFAULT_SIZE_INDEX = 3;
const SQUARE_TOLERANCE = 0.08;
const FLASH_DURATION = 1800;

const logoUrl = browser.runtime.getURL('/icons/48.png' as never);

const { mode: themeMode, cycle: cycleTheme } = useTheme();
const { seen: tourSeen, start: startTour } = useTour();
const TOUR_DELAY = 700;

const THEME_META = {
  auto: { label: 'Tema: automático', icon: Monitor },
  light: { label: 'Tema: claro', icon: Sun },
  dark: { label: 'Tema: escuro', icon: Moon },
} as const;

const {
  page,
  images,
  status,
  scanningFrames,
  measuring,
  waitingPage,
  generation,
  scan,
  showNow,
  addImage,
  setDimensions,
} = usePageImages();

const format = useStorage<OutputFormat>('pixima:format', 'original');
const quality = useStorage('pixima:quality', 90);
const naming = useStorage<NamingMode>('pixima:naming', 'original');
const groupVersions = useStorage('pixima:group-versions', true);
const layout = useStorage<'grid' | 'list'>('pixima:layout', 'grid');
const sort = useStorage<SortMode>('pixima:sort', 'page');

const sizeIndex = ref(DEFAULT_SIZE_INDEX);
const selectedFormats = ref<string[]>([]);
const orientation = ref<Orientation>('all');
const kindFilter = ref<KindFilter>('all');

const filtersOpen = ref(false);
const exportOpen = ref(false);

const options = reactive({ format, quality, naming });
const { progress, copyImage, copyUrl, openInTab, downloadOne, downloadMany } = useImageActions(
  page,
  options,
);

const selected = ref(new Set<string>());
const pinned = ref(new Set<string>());
const flashUrl = ref('');
const previewIndex = ref<number | null>(null);
let lastToggled = -1;

const grouped = computed(() =>
  groupVersions.value ? groupVariants(images.value) : { items: images.value, hidden: 0 },
);

const baseItems = computed(() => {
  const items = grouped.value.items;
  const known = new Set(items.map((image) => image.url));
  const extra = images.value.filter((image) => pinned.value.has(image.url) && !known.has(image.url));
  return [...items, ...extra];
});

const usable = computed(() =>
  baseItems.value.filter(
    (image) =>
      pinned.value.has(image.url) ||
      (!isTracker(image) && effectiveKind(image) !== 'icon' && image.width && image.height),
  ),
);

const availableFormats = computed(() => {
  const counts = new Map<string, number>();
  for (const image of usable.value) {
    const name = formatOf(image);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
});

function matchesOrientation(image: ScannedImage) {
  if (orientation.value === 'all') return true;
  const ratio = image.width / image.height;
  if (Math.abs(ratio - 1) <= SQUARE_TOLERANCE) return orientation.value === 'square';
  return orientation.value === (ratio > 1 ? 'landscape' : 'portrait');
}

const filtered = computed(() => {
  const threshold = SIZE_STEPS[sizeIndex.value] ?? 0;
  return usable.value.filter((image) => {
    if (pinned.value.has(image.url)) return true;
    if (Math.max(image.width, image.height) < threshold) return false;
    if (selectedFormats.value.length && !selectedFormats.value.includes(formatOf(image))) return false;
    return matchesOrientation(image);
  });
});

const kindCounts = computed(() => {
  const counts = new Map<ImageKind, number>();
  for (const image of filtered.value) {
    const kind = effectiveKind(image);
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
});

function nameOf(image: ScannedImage, index: number) {
  if (image.url.startsWith('data:')) return image.alt || `${KIND_LABELS[image.kind]} ${index + 1}`;
  return baseName(image, index);
}

const visible = computed(() => {
  const list =
    kindFilter.value === 'all'
      ? filtered.value
      : filtered.value.filter((image) => effectiveKind(image) === kindFilter.value);
  if (sort.value === 'largest') return [...list].sort((a, b) => b.width * b.height - a.width * a.height);
  if (sort.value === 'smallest') return [...list].sort((a, b) => a.width * a.height - b.width * b.height);
  if (sort.value === 'name') {
    return [...list].sort((a, b) => nameOf(a, 0).localeCompare(nameOf(b, 0), 'pt-BR'));
  }
  return list;
});

const activeFilterCount = computed(
  () =>
    Number(sizeIndex.value !== DEFAULT_SIZE_INDEX) +
    Number(selectedFormats.value.length > 0) +
    Number(orientation.value !== 'all') +
    Number(sort.value !== 'page') +
    Number(!groupVersions.value),
);

const selectedVisible = computed(() => visible.value.filter((image) => selected.value.has(image.url)));
const hasSelection = computed(() => selectedVisible.value.length > 0);

const selectAllState = computed(() => {
  if (!hasSelection.value) return false;
  return selectedVisible.value.length === visible.value.length ? true : 'indeterminate';
});

const downloadTargets = computed(() => (hasSelection.value ? selectedVisible.value : visible.value));

const downloadLabel = computed(() => {
  if (progress.value) return `Preparando ${progress.value.done} de ${progress.value.total}`;
  const count = downloadTargets.value.length;
  if (count === 1) return 'Baixar imagem';
  return hasSelection.value ? `Baixar ${count} selecionadas` : `Baixar todas (${count})`;
});

const downloadHint = computed(() => {
  if (progress.value) return 'Montando o arquivo…';
  const lossy = format.value === 'jpeg' || format.value === 'webp';
  const files = downloadTargets.value.length > 1 ? 'ZIP · ' : '';
  return `${files}${FORMAT_LABELS[format.value]}${lossy ? ` ${quality.value}%` : ''}`;
});

const pageHost = computed(() => {
  try {
    return new URL(page.value?.url ?? '').hostname;
  } catch {
    return '';
  }
});

watch(
  () => status.value === 'ready' && visible.value.length > 0,
  async (ready) => {
    if (!ready || tourSeen.value) return;
    await nextTick();
    setTimeout(() => {
      if (!tourSeen.value) startTour();
    }, TOUR_DELAY);
  },
);

watch(generation, () => {
  selected.value = new Set();
  pinned.value = new Set();
  lastToggled = -1;
  picker.cancel();
});

watch(images, () => {
  if (kindFilter.value !== 'all' && !images.value.some((image) => effectiveKind(image) === kindFilter.value)) {
    kindFilter.value = 'all';
  }
});

watch([kindFilter, sizeIndex, selectedFormats, orientation, sort], () => {
  lastToggled = -1;
});

async function handlePicked(image: ScannedImage) {
  addImage(image);
  pinned.value = new Set(pinned.value).add(image.url);
  selected.value = new Set(selected.value).add(image.url);
  kindFilter.value = 'all';
  await nextTick();
  document
    .querySelector(`[data-url="${CSS.escape(image.url)}"]`)
    ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  flashUrl.value = image.url;
  setTimeout(() => {
    if (flashUrl.value === image.url) flashUrl.value = '';
  }, FLASH_DURATION);
  toast.success('Imagem selecionada');
}

const picker = useImagePicker(page, handlePicked);

function cardLabel(image: ScannedImage) {
  return guessExtension(image.url) || KIND_BADGES[image.kind];
}

function toggle(image: ScannedImage, index: number, range: boolean) {
  if (range && lastToggled >= 0) {
    const [from, to] = [Math.min(lastToggled, index), Math.max(lastToggled, index)];
    for (const item of visible.value.slice(from, to + 1)) selected.value.add(item.url);
  } else if (!selected.value.delete(image.url)) {
    selected.value.add(image.url);
  }
  lastToggled = index;
}

function toggleAll() {
  if (selectAllState.value === true) {
    for (const image of visible.value) selected.value.delete(image.url);
  } else {
    for (const image of visible.value) selected.value.add(image.url);
  }
}

function clearSelection() {
  selected.value = new Set();
  lastToggled = -1;
}

function resetFilters() {
  sizeIndex.value = DEFAULT_SIZE_INDEX;
  selectedFormats.value = [];
  orientation.value = 'all';
  sort.value = 'page';
  groupVersions.value = true;
  kindFilter.value = 'all';
}

function downloadFromPreview(image: ScannedImage, index: number) {
  downloadOne(image, index);
}

function downloadFromSheet() {
  exportOpen.value = false;
  downloadMany(downloadTargets.value);
}
</script>

<template>
  <div class="bg-background flex h-full flex-col">
    <header class="z-10 border-b">
      <div class="bg-header text-header-foreground flex h-14 items-center gap-2.5 px-3 shadow-md">
        <img :src="logoUrl" alt="" class="size-8 shrink-0 rounded-lg shadow-sm">
        <div class="min-w-0 flex-1">
          <h1 class="text-sm leading-tight font-semibold tracking-tight">Pixima</h1>
          <p class="flex items-center gap-1 truncate text-xs text-white/70">
            <img
              v-if="page?.favIconUrl"
              :src="page.favIconUrl"
              alt=""
              class="size-3 shrink-0 rounded-sm"
              referrerpolicy="no-referrer"
            >
            <Globe v-else class="size-3 shrink-0" />
            <span class="truncate">{{ pageHost || 'Nenhuma página' }}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="text-header-foreground hover:bg-white/10 hover:text-white"
          title="Como funciona"
          aria-label="Como funciona"
          :disabled="status !== 'ready'"
          @click="startTour"
        >
          <CircleHelp />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="text-header-foreground hover:bg-white/10 hover:text-white"
          :title="THEME_META[themeMode].label"
          :aria-label="THEME_META[themeMode].label"
          @click="cycleTheme"
        >
          <component :is="THEME_META[themeMode].icon" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="text-header-foreground hover:bg-white/10 hover:text-white"
          title="Escanear de novo"
          aria-label="Escanear de novo"
          :disabled="status === 'loading'"
          @click="scan"
        >
          <RefreshCw :class="status === 'loading' && 'animate-spin'" />
        </Button>
      </div>

      <div class="bg-background flex items-center gap-2 px-3 py-2.5">
        <div data-tour="tabs" class="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pr-6 [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)] [scrollbar-width:none]" role="tablist" aria-label="Tipo de imagem">
          <button
            v-for="chip in [['all', 'Todas', filtered.length], ...kindCounts.map(([kind, count]) => [kind, KIND_LABELS[kind], count])] as [KindFilter, string, number][]"
            :key="chip[0]"
            type="button"
            role="tab"
            :aria-selected="kindFilter === chip[0]"
            :class="
              cn(
                'focus-visible:ring-ring flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2',
                kindFilter === chip[0]
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
              )
            "
            @click="kindFilter = chip[0]"
          >
            {{ chip[1] }}
            <span class="tabular-nums opacity-70">{{ chip[2] }}</span>
          </button>
        </div>

        <div class="bg-secondary flex shrink-0 rounded-md p-0.5" role="group" aria-label="Modo de exibição">
          <button
            v-for="mode in [{ id: 'grid', label: 'Grade', icon: LayoutGrid }, { id: 'list', label: 'Lista', icon: List }] as const"
            :key="mode.id"
            type="button"
            :title="mode.label"
            :aria-label="mode.label"
            :aria-pressed="layout === mode.id"
            :class="
              cn(
                'focus-visible:ring-ring flex size-6 items-center justify-center rounded transition-colors outline-none focus-visible:ring-2',
                layout === mode.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="layout = mode.id"
          >
            <component :is="mode.icon" class="size-3.5" />
          </button>
        </div>
      </div>
    </header>

    <div class="flex h-10 items-center justify-between gap-2 border-b px-3">
      <p class="text-muted-foreground flex min-w-0 items-center gap-1.5 truncate text-xs" aria-live="polite">
        <template v-if="status === 'loading'">
          <LoaderCircle class="size-3.5 shrink-0 animate-spin" />
          {{ waitingPage ? 'Aguardando a página carregar…' : 'Procurando imagens…' }}
        </template>
        <template v-else-if="status === 'ready' && picker.picking.value">
          <Crosshair class="text-primary size-3.5 shrink-0" />
          Clique numa imagem da página
        </template>
        <template v-else-if="status === 'ready'">
          <span class="text-foreground font-medium tabular-nums">{{ visible.length }}</span>
          {{ visible.length === 1 ? 'imagem' : 'imagens' }}
          <LoaderCircle
            v-if="scanningFrames || measuring > 0"
            class="size-3 shrink-0 animate-spin"
            :title="measuring > 0 ? `Medindo ${measuring} imagens` : 'Procurando em quadros da página'"
          />
        </template>
      </p>
      <Button
        v-if="status === 'loading' && waitingPage"
        variant="ghost"
        size="sm"
        class="text-primary h-7 px-2 text-xs"
        @click="showNow"
      >
        Mostrar agora
      </Button>
      <Button
        v-if="status === 'ready'"
        :variant="picker.picking.value ? 'default' : 'outline'"
        size="sm"
        data-tour="pick"
        class="ml-auto h-7 shrink-0 gap-1.5 px-2.5 text-xs"
        :title="picker.picking.value ? 'Cancelar a seleção na página' : 'Escolher uma imagem direto na página'"
        @click="picker.toggle"
      >
        <component :is="picker.picking.value ? X : Crosshair" class="size-3.5" />
        {{ picker.picking.value ? 'Cancelar' : 'Escolher na página' }}
      </Button>
      <Button
        v-if="status === 'ready'"
        variant="outline"
        size="sm"
        data-tour="filters"
        class="h-7 gap-1.5 px-2.5 text-xs"
        @click="filtersOpen = true"
      >
        <SlidersHorizontal class="size-3.5" />
        Filtros
        <span
          v-if="activeFilterCount"
          class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums"
        >
          {{ activeFilterCount }}
        </span>
      </Button>
    </div>

    <main class="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
      <div
        v-if="status === 'loading'"
        :class="layout === 'grid' ? 'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5' : 'space-y-2'"
      >
        <Skeleton
          v-for="index in 8"
          :key="index"
          :class="layout === 'grid' ? 'aspect-[4/5] rounded-xl' : 'h-[68px] rounded-xl'"
        />
      </div>

      <div
        v-else-if="status === 'blocked'"
        class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <div class="bg-muted flex size-14 items-center justify-center rounded-2xl">
          <ShieldAlert class="text-muted-foreground size-7" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-semibold">Esta página não pode ser escaneada</p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            O navegador não permite extensões em páginas internas, na loja de extensões e em alguns
            arquivos locais.
          </p>
        </div>
      </div>

      <div
        v-else-if="!visible.length"
        class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <div class="bg-muted flex size-14 items-center justify-center rounded-2xl">
          <ImageOff class="text-muted-foreground size-7" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-semibold">
            {{ images.length ? 'Nada com esses filtros' : 'Nenhuma imagem nesta página' }}
          </p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{
              images.length
                ? 'Ajuste ou redefina os filtros.'
                : 'Role a página para carregar mais conteúdo e escaneie de novo.'
            }}
          </p>
        </div>
        <Button v-if="images.length" variant="outline" size="sm" @click="resetFilters">
          Redefinir filtros
        </Button>
      </div>

      <template v-else>
        <div
          :key="generation"
          :class="
            cn(
              'animate-in fade-in-0 duration-300 motion-reduce:animate-none',
              layout === 'grid' ? 'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5' : 'space-y-2',
            )
          "
        >
          <ImageCard
            v-for="(image, index) in visible"
            :key="image.url"
            :image="image"
            :name="nameOf(image, index)"
            :label="cardLabel(image)"
            :selected="selected.has(image.url)"
            :selecting="hasSelection"
            :layout="layout"
            :data-tour="index === 0 ? 'card' : undefined"
            :data-url="image.url"
            :highlight="flashUrl === image.url"
            @toggle="(range) => toggle(image, index, range)"
            @preview="previewIndex = index"
            @copy="copyImage(image)"
            @copy-url="copyUrl(image)"
            @download="downloadOne(image, index)"
            @open="openInTab(image)"
            @measured="(width, height) => setDimensions(image.url, width, height)"
          />
        </div>
      </template>
    </main>

    <footer class="bg-background space-y-2 border-t px-3 pt-2 pb-3">
      <div class="flex h-6 items-center justify-between">
        <label class="flex cursor-pointer items-center gap-2 text-xs font-medium">
          <Checkbox
            :model-value="selectAllState"
            :disabled="!visible.length"
            @update:model-value="toggleAll"
          />
          {{ hasSelection ? `${selectedVisible.length} selecionadas` : 'Selecionar todas' }}
        </label>
        <button
          v-if="hasSelection"
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center gap-1 rounded text-xs outline-none focus-visible:ring-2"
          @click="clearSelection"
        >
          <X class="size-3.5" />
          Limpar
        </button>
      </div>

      <div class="flex gap-2">
        <Button
          data-tour="download"
          class="h-11 flex-1 flex-col gap-0 rounded-lg shadow-sm"
          :disabled="!downloadTargets.length || !!progress"
          @click="downloadMany(downloadTargets)"
        >
          <span class="flex items-center gap-2 text-sm leading-tight font-semibold">
            <LoaderCircle v-if="progress" class="animate-spin" />
            <Download v-else />
            {{ downloadLabel }}
          </span>
          <span class="text-[10px] leading-tight font-normal opacity-80">{{ downloadHint }}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          data-tour="export"
          class="size-11 shrink-0 rounded-lg"
          title="Opções de exportação"
          aria-label="Opções de exportação"
          @click="exportOpen = true"
        >
          <Settings />
        </Button>
      </div>
    </footer>

    <FilterSheet
      v-model:open="filtersOpen"
      v-model:size-index="sizeIndex"
      v-model:selected-formats="selectedFormats"
      v-model:orientation="orientation"
      v-model:sort="sort"
      v-model:group="groupVersions"
      :size-steps="SIZE_STEPS"
      :formats="availableFormats"
      :hidden-by-group="grouped.hidden"
      :result-count="visible.length"
      @reset="resetFilters"
    />
    <ExportSheet
      v-model:open="exportOpen"
      v-model:format="format"
      v-model:quality="quality"
      v-model:naming="naming"
      :count="downloadTargets.length"
      :busy="!!progress"
      @download="downloadFromSheet"
    />
    <PreviewDialog
      v-model:index="previewIndex"
      :images="visible"
      :name-of="nameOf"
      @copy="copyImage"
      @copy-url="copyUrl"
      @download="downloadFromPreview"
      @open="openInTab"
    />
    <Toaster position="bottom-center" :offset="{ bottom: 128 }" :mobile-offset="{ bottom: 128, left: 16, right: 16 }" theme="system" rich-colors />
  </div>
</template>
