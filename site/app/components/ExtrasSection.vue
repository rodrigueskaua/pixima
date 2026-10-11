<script setup lang="ts">
import { extras } from '~/data/content';
</script>

<template>
  <section class="border-border border-t">
    <div class="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <h2 class="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">E mais alguns detalhes</h2>
      <ul class="grid list-disc gap-3 pl-5 text-lg leading-relaxed marker:text-primary">
        <li v-for="item in extras" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
