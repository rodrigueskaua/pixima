<script setup lang="ts">
import galeria from '@docs/galeria.png';
import { features } from '~/data/content';
</script>

<template>
  <section id="recursos" class="mx-auto w-full max-w-6xl px-5 py-20">
    <SectionHeading
      title="Chega de salvar imagem por imagem"
      subtitle="Em vez de clicar com o botão direito em cada foto, veja tudo de uma vez, já organizado."
    />
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="border-border bg-card overflow-hidden rounded-2xl border p-7 transition-shadow hover:shadow-[var(--shadow)]"
        :class="[
          feature.wide && 'lg:col-span-2 lg:grid lg:grid-cols-[1fr_220px] lg:gap-8',
          feature.full && 'bg-accent! text-accent-foreground md:col-span-2 lg:col-span-3',
        ]"
      >
        <div>
          <div
            class="mb-5 grid size-11 place-items-center rounded-xl"
            :class="feature.full ? 'bg-card text-primary' : 'bg-accent text-accent-foreground'"
          >
            <component :is="feature.icon" class="size-[22px]" />
          </div>
          <h3 class="text-lg font-bold tracking-tight">{{ feature.title }}</h3>
          <p class="mt-2" :class="feature.full ? 'max-w-2xl opacity-85' : 'text-muted-foreground'">{{ feature.text }}</p>
        </div>
        <div v-if="feature.wide" class="mt-6 hidden h-52 overflow-hidden rounded-xl border border-border lg:mt-0 lg:block">
          <img
            :src="galeria"
            width="800"
            height="1600"
            alt="Galeria do Pixima com as imagens de uma página"
            loading="lazy"
            class="w-full object-cover object-top"
          >
        </div>
      </article>
    </div>
  </section>
</template>
