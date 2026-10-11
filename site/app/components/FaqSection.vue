<script setup lang="ts">
import { faq } from '~/data/content';
</script>

<template>
  <section id="perguntas" class="border-border border-t">
    <div class="mx-auto w-full max-w-6xl px-5 py-20">
      <h2 class="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">Perguntas</h2>
      <dl class="mt-10 grid gap-x-16 gap-y-9 md:grid-cols-2">
        <div v-for="item in faq" :key="item.question">
          <dt class="font-semibold">{{ item.question }}</dt>
          <dd class="text-muted-foreground mt-2 leading-relaxed">{{ item.answer }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
