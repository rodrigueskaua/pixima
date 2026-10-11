<script setup lang="ts">
import { ChevronLeft, ChevronRight, Copy, Download, ExternalLink, Link } from '@lucide/vue';
import { useEventListener } from '@vueuse/core';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ScannedImage } from '@/shared/types';
import { formatBytes } from '@/utils/images';

const props = defineProps<{
  images: ScannedImage[];
  index: number | null;
  nameOf: (image: ScannedImage, index: number) => string;
}>();

const emit = defineEmits<{
  'update:index': [value: number | null];
  copy: [image: ScannedImage];
  copyUrl: [image: ScannedImage];
  download: [image: ScannedImage, index: number];
  open: [image: ScannedImage];
}>();

const image = computed(() => (props.index === null ? null : (props.images[props.index] ?? null)));

const summary = computed(() => {
  if (!image.value) return '';
  const { width, height, bytes } = image.value;
  return [width && height ? `${width} × ${height}` : '', formatBytes(bytes)]
    .filter(Boolean)
    .join(' · ');
});

function step(direction: number) {
  if (props.index === null || !props.images.length) return;
  emit('update:index', (props.index + direction + props.images.length) % props.images.length);
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (props.index === null) return;
  if (event.key === 'ArrowLeft') step(-1);
  if (event.key === 'ArrowRight') step(1);
});
</script>

<template>
  <Dialog :open="index !== null" @update:open="(open) => !open && emit('update:index', null)">
    <DialogContent v-if="image && index !== null" class="gap-3 p-4 sm:max-w-[calc(100%-1.5rem)]">
      <DialogHeader class="pr-6 text-left">
        <DialogTitle class="truncate text-sm">{{ nameOf(image, index) }}</DialogTitle>
        <DialogDescription class="text-xs">
          {{ summary || 'Dimensões ainda desconhecidas' }} · {{ index + 1 }} de {{ images.length }}
        </DialogDescription>
      </DialogHeader>

      <div class="checkerboard relative flex h-[min(52vh,420px)] items-center justify-center overflow-hidden rounded-lg border">
        <img
          :key="image.url"
          :src="image.url"
          :alt="image.alt"
          referrerpolicy="no-referrer"
          class="animate-in fade-in-0 zoom-in-95 size-full object-contain duration-200"
        >
        <template v-if="images.length > 1">
          <Button
            variant="secondary"
            size="icon"
            class="absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full shadow"
            aria-label="Imagem anterior"
            @click="step(-1)"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            class="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full shadow"
            aria-label="Próxima imagem"
            @click="step(1)"
          >
            <ChevronRight />
          </Button>
        </template>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <Button @click="emit('download', image, index)">
          <Download />
          Baixar
        </Button>
        <Button variant="secondary" @click="emit('copy', image)">
          <Copy />
          Copiar
        </Button>
        <Button variant="outline" size="sm" @click="emit('copyUrl', image)">
          <Link />
          Endereço
        </Button>
        <Button variant="outline" size="sm" @click="emit('open', image)">
          <ExternalLink />
          Nova aba
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
