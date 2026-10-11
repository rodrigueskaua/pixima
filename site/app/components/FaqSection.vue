<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { faq } from '~/data/content';
</script>

<template>
  <section id="perguntas" class="mx-auto w-full max-w-6xl px-5 py-20">
    <SectionHeading title="Perguntas frequentes" />
    <div class="grid max-w-3xl gap-3">
      <details
        v-for="item in faq"
        :key="item.question"
        class="group border-border bg-card rounded-xl border px-5 open:shadow-sm"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
          {{ item.question }}
          <Plus class="text-primary size-5 shrink-0 transition-transform group-open:rotate-45" />
        </summary>
        <p class="text-muted-foreground pb-4">{{ item.answer }}</p>
      </details>
    </div>
  </section>
</template>
