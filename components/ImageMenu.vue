<script setup lang="ts">
import { Ellipsis, ExternalLink, Link } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

defineProps<{ class?: HTMLAttributes['class'] }>();

const emit = defineEmits<{ copyUrl: []; open: [] }>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        :class="$props.class"
        title="Mais ações"
        aria-label="Mais ações"
      >
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @select="emit('copyUrl')">
        <Link />
        Copiar endereço
      </DropdownMenuItem>
      <DropdownMenuItem @select="emit('open')">
        <ExternalLink />
        Abrir em nova aba
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
