<script setup lang="ts">
import { steps } from '~/data/content';
</script>

<template>
  <section id="como-usar" class="mx-auto w-full max-w-6xl px-5 py-20">
    <SectionHeading title="Como usar" subtitle="São três passos, e o Pixima mostra um tour rápido na primeira vez." />
    <ol class="grid gap-5 md:grid-cols-3">
      <li v-for="(step, index) in steps" :key="step.title" class="border-border bg-card rounded-2xl border p-7">
        <span class="bg-sun text-sun-foreground mb-5 grid size-10 place-items-center rounded-full text-lg font-extrabold">
          {{ index + 1 }}
        </span>
        <h3 class="text-lg font-bold tracking-tight">{{ step.title }}</h3>
        <p class="text-muted-foreground mt-2">{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>
