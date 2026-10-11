<script setup lang="ts">
import { Check, Copy, Download, Eye, ImageOff } from '@lucide/vue';
import { computed, ref } from 'vue';
import ImageMenu from '@/components/ImageMenu.vue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ScannedImage } from '@/shared/types';
import { formatBytes } from '@/utils/images';

const props = defineProps<{
  image: ScannedImage;
  name: string;
  label: string;
  selected: boolean;
  selecting: boolean;
  layout: 'grid' | 'list';
  highlight?: boolean;
}>();

const emit = defineEmits<{
  toggle: [range: boolean];
  preview: [];
  copy: [];
  copyUrl: [];
  download: [];
  open: [];
  measured: [width: number, height: number];
}>();

const failed = ref(false);

const dimensions = computed(() =>
  props.image.width && props.image.height ? `${props.image.width} × ${props.image.height}` : '',
);

const details = computed(
  () => [dimensions.value, formatBytes(props.image.bytes)].filter(Boolean).join(' · ') || '—',
);

const overlayButton =
  'size-7 rounded-md bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-background';

function onLoad(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target.naturalWidth && target.naturalHeight) {
    emit('measured', target.naturalWidth, target.naturalHeight);
  }
}

function onToggle(event: MouseEvent) {
  emit('toggle', event.shiftKey);
}
</script>

<template>
  <article
    :class="
      cn(
        'group bg-card relative overflow-hidden rounded-lg border transition-[box-shadow,border-color] [content-visibility:auto]',
        'hover:border-primary/40 hover:shadow-md motion-reduce:transition-none',
        selected && 'border-primary ring-primary ring-2',
        highlight && 'ring-sun! ring-4 ring-offset-2 ring-offset-background',
        layout === 'grid'
          ? '[contain-intrinsic-size:auto_150px] aspect-square'
          : '[contain-intrinsic-size:auto_60px] flex items-center gap-2.5 p-1.5',
      )
    "
  >
    <button
      type="button"
      :aria-pressed="selected"
      :aria-label="`${selected ? 'Desmarcar' : 'Selecionar'} ${name}`"
      :title="name"
      :class="
        cn(
          'checkerboard focus-visible:ring-ring relative block shrink-0 overflow-hidden outline-none focus-visible:ring-2',
          layout === 'grid' ? 'size-full' : 'size-12 rounded-md',
        )
      "
      @click="onToggle"
      @dblclick="emit('preview')"
    >
      <img
        v-if="!failed"
        :src="image.url"
        :alt="image.alt"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        :class="
          cn(
            'size-full transition-transform duration-300 motion-reduce:transition-none',
            layout === 'grid' ? 'object-cover group-hover:scale-105' : 'object-contain',
          )
        "
        @load="onLoad"
        @error="failed = true"
      >
      <span v-else class="text-muted-foreground flex size-full items-center justify-center">
        <ImageOff class="size-5" />
      </span>
    </button>

    <template v-if="layout === 'grid'">
      <span
        class="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-[#102a43]/85 via-[#102a43]/40 to-transparent px-1.5 pt-6 pb-1 text-[10px] leading-tight font-medium text-white"
      >
        <span class="truncate">{{ details }}</span>
        <span class="shrink-0 rounded-sm bg-white/20 px-1 py-px font-semibold tracking-wide uppercase backdrop-blur-sm">
          {{ label }}
        </span>
      </span>

      <span
        aria-hidden="true"
        :class="
          cn(
            'pointer-events-none absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full border-2 transition-all',
            selected
              ? 'bg-sun border-sun text-sun-foreground scale-100 opacity-100'
              : 'border-white bg-black/30 text-transparent shadow-sm backdrop-blur',
            !selected &&
              !selecting &&
              'scale-90 opacity-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100',
          )
        "
      >
        <Check class="size-3" stroke-width="3.5" />
      </span>

      <div
        class="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 has-[[data-state=open]]:opacity-100"
      >
        <Button variant="ghost" size="icon" :class="overlayButton" title="Ver em tamanho maior" aria-label="Ver em tamanho maior" @click="emit('preview')">
          <Eye />
        </Button>
        <Button variant="ghost" size="icon" :class="overlayButton" title="Copiar imagem" aria-label="Copiar imagem" @click="emit('copy')">
          <Copy />
        </Button>
        <Button variant="ghost" size="icon" :class="overlayButton" title="Baixar" aria-label="Baixar" @click="emit('download')">
          <Download />
        </Button>
        <ImageMenu :class="overlayButton" @copy-url="emit('copyUrl')" @open="emit('open')" />
      </div>
    </template>

    <template v-else>
      <span
        aria-hidden="true"
        :class="
          cn(
            'pointer-events-none absolute top-1 left-1 flex size-4 items-center justify-center rounded-full border-2 transition-all',
            selected
              ? 'bg-sun border-sun text-sun-foreground opacity-100'
              : 'border-white bg-black/30 text-transparent shadow-sm',
            !selected && !selecting && 'opacity-0 group-hover:opacity-100',
          )
        "
      >
        <Check class="size-2.5" stroke-width="4" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <p class="truncate text-xs font-medium" :title="name">{{ name }}</p>
          <span class="bg-secondary text-secondary-foreground shrink-0 rounded px-1.5 py-px text-[10px] font-semibold uppercase">
            {{ label }}
          </span>
        </div>
        <p class="text-muted-foreground mt-0.5 truncate text-[11px]">{{ details }}</p>
      </div>

      <div class="flex shrink-0 items-center">
        <Button variant="ghost" size="icon" class="size-8" title="Ver em tamanho maior" aria-label="Ver em tamanho maior" @click="emit('preview')">
          <Eye />
        </Button>
        <Button variant="ghost" size="icon" class="size-8" title="Copiar imagem" aria-label="Copiar imagem" @click="emit('copy')">
          <Copy />
        </Button>
        <Button variant="ghost" size="icon" class="size-8" title="Baixar" aria-label="Baixar" @click="emit('download')">
          <Download />
        </Button>
        <ImageMenu class="size-8" @copy-url="emit('copyUrl')" @open="emit('open')" />
      </div>
    </template>
  </article>
</template>
