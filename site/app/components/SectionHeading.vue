<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="mb-10 max-w-2xl">
    <h2 class="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{{ title }}</h2>
    <p v-if="subtitle" class="text-muted-foreground mt-3 text-lg">{{ subtitle }}</p>
  </div>
</template>
