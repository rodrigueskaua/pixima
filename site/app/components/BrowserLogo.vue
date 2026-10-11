<script setup lang="ts">
defineProps<{ path: string }>();
</script>

<template>
  <svg viewBox="0 0 24 24" aria-hidden="true" class="size-[18px] fill-current">
    <path :d="path" />
  </svg>
</template>
