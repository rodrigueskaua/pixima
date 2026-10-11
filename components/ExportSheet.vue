<script setup lang="ts">
import { Download } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { NamingMode, OutputFormat } from '@/shared/types';

const props = defineProps<{
  open: boolean;
  format: OutputFormat;
  quality: number;
  naming: NamingMode;
  count: number;
  busy: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:format': [value: OutputFormat];
  'update:quality': [value: number];
  'update:naming': [value: NamingMode];
  download: [];
}>();

const FORMATS: { value: OutputFormat; label: string; hint: string }[] = [
  { value: 'original', label: 'Original', hint: 'Sem alterar' },
  { value: 'png', label: 'PNG', hint: 'Sem perdas' },
  { value: 'jpeg', label: 'JPG', hint: 'Menor, sem transparência' },
  { value: 'webp', label: 'WebP', hint: 'Menor, moderno' },
];

const NAMINGS: { value: NamingMode; label: string; hint: string }[] = [
  { value: 'original', label: 'Nome original', hint: 'foto-casa.jpg' },
  { value: 'sequence', label: 'Numerados', hint: 'pixima-001.jpg' },
];

const isLossy = computed(() => props.format === 'jpeg' || props.format === 'webp');

const qualityModel = computed({
  get: () => [props.quality],
  set: (value: number[] | undefined) => emit('update:quality', value?.[0] ?? props.quality),
});

const summary = computed(() => {
  const files = props.count === 1 ? '1 imagem' : `${props.count} imagens (ZIP)`;
  const format = FORMATS.find((item) => item.value === props.format)?.label ?? '';
  return `${files} · ${format}${isLossy.value ? ` ${props.quality}%` : ''}`;
});

const option = (active: boolean) =>
  cn(
    'focus-visible:ring-ring flex flex-col items-start rounded-lg border p-2.5 text-left transition-colors outline-none focus-visible:ring-2',
    active
      ? 'border-primary bg-accent text-accent-foreground ring-primary ring-1'
      : 'bg-background hover:bg-accent/50',
  );
</script>

<template>
  <Sheet :open="open" @update:open="(value) => emit('update:open', value)">
    <SheetContent side="bottom" class="bg-card max-h-[88vh] gap-0 rounded-t-2xl border-t-2 p-0 shadow-2xl">
      <SheetHeader class="px-4 pt-4 pb-2 text-left">
        <SheetTitle class="text-base">Exportar</SheetTitle>
        <SheetDescription class="text-xs">{{ summary }}</SheetDescription>
      </SheetHeader>

      <div class="space-y-5 overflow-y-auto px-4 py-3">
        <section class="space-y-2.5">
          <h3 class="text-sm font-medium">Formato</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in FORMATS"
              :key="item.value"
              type="button"
              :aria-pressed="format === item.value"
              :class="option(format === item.value)"
              @click="emit('update:format', item.value)"
            >
              <span class="text-sm font-semibold">{{ item.label }}</span>
              <span class="text-muted-foreground text-[11px]">{{ item.hint }}</span>
            </button>
          </div>
          <div v-if="isLossy" class="animate-in fade-in-0 slide-in-from-top-1 space-y-2 pt-1">
            <div class="flex items-baseline justify-between text-xs">
              <span class="text-muted-foreground">Qualidade</span>
              <span class="text-primary font-medium tabular-nums">{{ quality }}%</span>
            </div>
            <Slider v-model="qualityModel" :min="10" :max="100" :step="5" />
          </div>
        </section>

        <section class="space-y-2.5">
          <h3 class="text-sm font-medium">Nome dos arquivos</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in NAMINGS"
              :key="item.value"
              type="button"
              :aria-pressed="naming === item.value"
              :class="option(naming === item.value)"
              @click="emit('update:naming', item.value)"
            >
              <span class="text-sm font-semibold">{{ item.label }}</span>
              <span class="text-muted-foreground font-mono text-[11px]">{{ item.hint }}</span>
            </button>
          </div>
        </section>
      </div>

      <SheetFooter class="border-t p-3">
        <Button class="h-11 w-full" :disabled="busy || !count" @click="emit('download')">
          <Download />
          Baixar {{ count === 1 ? 'imagem' : `${count} imagens` }}
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
