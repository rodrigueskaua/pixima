<script setup lang="ts">
import { RotateCcw } from '@lucide/vue';
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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type Orientation = 'all' | 'landscape' | 'portrait' | 'square';
export type SortMode = 'page' | 'largest' | 'smallest' | 'name';

const props = defineProps<{
  open: boolean;
  sizeSteps: number[];
  sizeIndex: number;
  formats: { name: string; count: number }[];
  selectedFormats: string[];
  orientation: Orientation;
  sort: SortMode;
  group: boolean;
  hiddenByGroup: number;
  resultCount: number;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:sizeIndex': [value: number];
  'update:selectedFormats': [value: string[]];
  'update:orientation': [value: Orientation];
  'update:sort': [value: SortMode];
  'update:group': [value: boolean];
  reset: [];
}>();

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'landscape', label: 'Horizontal' },
  { value: 'portrait', label: 'Vertical' },
  { value: 'square', label: 'Quadrada' },
];

const SORTS: { value: SortMode; label: string }[] = [
  { value: 'page', label: 'Ordem da página' },
  { value: 'largest', label: 'Maiores primeiro' },
  { value: 'smallest', label: 'Menores primeiro' },
  { value: 'name', label: 'Nome (A–Z)' },
];

const sizeLabel = computed(() => {
  const value = props.sizeSteps[props.sizeIndex] ?? 0;
  return value ? `${value} px ou mais` : 'Qualquer tamanho';
});

const sizeModel = computed({
  get: () => [props.sizeIndex],
  set: (value: number[] | undefined) => emit('update:sizeIndex', value?.[0] ?? props.sizeIndex),
});

function toggleFormat(name: string) {
  const next = props.selectedFormats.includes(name)
    ? props.selectedFormats.filter((item) => item !== name)
    : [...props.selectedFormats, name];
  emit('update:selectedFormats', next);
}

const chip = (active: boolean) =>
  cn(
    'focus-visible:ring-ring rounded-md border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2',
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  );
</script>

<template>
  <Sheet :open="open" @update:open="(value) => emit('update:open', value)">
    <SheetContent side="bottom" class="bg-card max-h-[88vh] gap-0 rounded-t-2xl border-t-2 p-0 shadow-2xl">
      <SheetHeader class="px-4 pt-4 pb-2 text-left">
        <SheetTitle class="text-base">Filtros</SheetTitle>
        <SheetDescription class="text-xs">Refine o que aparece na galeria.</SheetDescription>
      </SheetHeader>

      <div class="space-y-5 overflow-y-auto px-4 py-3">
        <section class="space-y-2.5">
          <div class="flex items-baseline justify-between">
            <h3 class="text-sm font-medium">Tamanho mínimo</h3>
            <span class="text-primary text-xs font-medium tabular-nums">{{ sizeLabel }}</span>
          </div>
          <Slider v-model="sizeModel" :min="0" :max="sizeSteps.length - 1" :step="1" />
          <div class="text-muted-foreground flex justify-between text-[10px] tabular-nums">
            <span>0</span>
            <span>{{ sizeSteps[Math.floor(sizeSteps.length / 2)] }}</span>
            <span>{{ sizeSteps[sizeSteps.length - 1] }}+</span>
          </div>
        </section>

        <section v-if="formats.length > 1" class="space-y-2.5">
          <h3 class="text-sm font-medium">Formato</h3>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="format in formats"
              :key="format.name"
              type="button"
              :aria-pressed="selectedFormats.includes(format.name)"
              :class="chip(selectedFormats.includes(format.name))"
              @click="toggleFormat(format.name)"
            >
              <span class="uppercase">{{ format.name }}</span>
              <span class="ml-1 tabular-nums opacity-70">{{ format.count }}</span>
            </button>
          </div>
        </section>

        <section class="space-y-2.5">
          <h3 class="text-sm font-medium">Orientação</h3>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="option in ORIENTATIONS"
              :key="option.value"
              type="button"
              :aria-pressed="orientation === option.value"
              :class="chip(orientation === option.value)"
              @click="emit('update:orientation', option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="space-y-2.5">
          <h3 class="text-sm font-medium">Ordenar por</h3>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="option in SORTS"
              :key="option.value"
              type="button"
              :aria-pressed="sort === option.value"
              :class="chip(sort === option.value)"
              @click="emit('update:sort', option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <h3 class="text-sm font-medium">Agrupar versões</h3>
            <p class="text-muted-foreground text-xs">
              Mostra só a maior versão de cada imagem<template v-if="group && hiddenByGroup">
                ({{ hiddenByGroup }} ocultas)</template>.
            </p>
          </div>
          <Switch :model-value="group" @update:model-value="(value) => emit('update:group', value)" />
        </section>
      </div>

      <SheetFooter class="flex-row gap-2 border-t p-3">
        <Button variant="outline" class="gap-1.5" @click="emit('reset')">
          <RotateCcw />
          Redefinir
        </Button>
        <Button class="flex-1" @click="emit('update:open', false)">
          Ver {{ resultCount }} {{ resultCount === 1 ? 'imagem' : 'imagens' }}
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
