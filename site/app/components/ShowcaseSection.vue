<script setup lang="ts">
import converter from '~/assets/img/converter.webp';
import filtrar from '~/assets/img/filtrar.webp';
import verTudo from '~/assets/img/ver-tudo.webp';
import verTudoPainel from '~/assets/img/ver-tudo-painel.webp';
import { showcase } from '~/data/content';

const panels = { 'ver-tudo': verTudoPainel, filtrar, converter };
</script>

<template>
  <div>
    <section v-for="(item, index) in showcase" :id="item.id" :key="item.id" class="border-border border-t">
      <div
        class="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 lg:gap-16"
        :class="[
          item.wide && 'lg:grid-cols-[1fr_1.4fr]',
          !item.wide && index % 2 === 0 && 'lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-24',
          !item.wide && index % 2 === 1 && 'lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-24',
          index % 2 === 1 && 'lg:[&>*:first-child]:order-2',
        ]"
      >
        <div>
          <h2 class="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">{{ item.title }}</h2>
          <p class="text-muted-foreground mt-4 text-lg leading-relaxed">{{ item.text }}</p>
          <ul class="mt-6 grid list-disc gap-2.5 pl-5 leading-relaxed marker:text-primary">
            <li v-for="point in item.points" :key="point">{{ point }}</li>
          </ul>
        </div>
        <div v-if="item.wide" class="grid">
          <img
            :src="verTudo"
            :alt="item.alt"
            width="1920"
            height="1200"
            loading="lazy"
            class="border-border hidden h-auto w-full rounded-xl border shadow-[var(--shadow)] lg:block"
          >
          <img
            :src="panels[item.image]"
            :alt="item.alt"
            width="600"
            height="1200"
            loading="lazy"
            class="border-border mx-auto h-auto w-full max-w-[420px] rounded-xl border shadow-[var(--shadow)] lg:hidden"
          >
        </div>
        <img
          v-else
          :src="panels[item.image]"
          :alt="item.alt"
          width="600"
          height="1200"
          loading="lazy"
          class="border-border mx-auto h-auto w-full max-w-[420px] rounded-xl border shadow-[var(--shadow)]"
        >
      </div>
    </section>
  </div>
</template>
