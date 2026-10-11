<script setup lang="ts">
import { Check } from '@lucide/vue';
import demo from '@docs/apresentacao.gif';
import { links, trust } from '~/data/content';
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 -top-40 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--glow),transparent)]"
      aria-hidden="true"
    />
    <div
      class="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-16 pb-20 lg:grid-cols-[1fr_1.1fr] lg:pt-24"
    >
      <div class="rise">
        <span class="bg-accent text-accent-foreground mb-5 inline-block rounded-full px-3.5 py-1.5 text-[13px] font-semibold">
          Chrome, Edge, Brave e Firefox
        </span>
        <h1 class="text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-[56px]">
          Todas as imagens de qualquer site
          <span class="from-primary bg-gradient-to-r to-sky-400 bg-clip-text text-transparent">num só painel.</span>
        </h1>
        <p class="text-muted-foreground mt-5 max-w-xl text-lg sm:text-xl">
          O Pixima abre um painel ao lado da página e mostra tudo o que ela tem. Escolha o que quiser, converta para
          PNG, JPG ou WebP e baixe tudo em um ZIP.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            :href="links.install"
            class="bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-[15px] font-semibold shadow-lg shadow-[var(--glow)] transition hover:brightness-110"
          >
            Instalar
          </a>
          <a
            :href="links.repo"
            class="border-border bg-card rounded-xl border px-6 py-3.5 text-[15px] font-semibold transition hover:bg-muted"
          >
            Ver no GitHub
          </a>
        </div>
        <ul class="text-muted-foreground mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li v-for="item in trust" :key="item" class="flex items-center gap-1.5">
            <Check class="text-primary size-4" stroke-width="3" />
            {{ item }}
          </li>
        </ul>
        <p class="text-muted-foreground mt-4 text-sm">
          Em breve na Chrome Web Store e no Firefox Add-ons. Por enquanto, a instalação é pelo GitHub.
        </p>
      </div>

      <div class="rise [animation-delay:120ms]">
        <div class="border-border bg-card overflow-hidden rounded-2xl border shadow-[var(--shadow)]">
          <div class="bg-header flex items-center gap-3 px-4 py-3" aria-hidden="true">
            <span class="flex gap-1.5">
              <span class="size-2.5 rounded-full bg-white/25" />
              <span class="size-2.5 rounded-full bg-white/25" />
              <span class="size-2.5 rounded-full bg-white/25" />
            </span>
            <span class="text-header-foreground/70 flex-1 rounded-md bg-white/10 px-3 py-1 text-xs">
              pt.wikipedia.org/wiki/Apollo_11
            </span>
          </div>
          <img
            :src="demo"
            width="800"
            height="500"
            alt="O Pixima na Wikipédia: ordenar as imagens, selecionar três, converter para WebP e baixar em um ZIP"
            class="h-auto w-full"
          >
        </div>
      </div>
    </div>
  </section>
</template>
