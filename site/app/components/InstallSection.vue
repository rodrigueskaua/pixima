<script setup lang="ts">
import { links } from '~/data/content';
</script>

<template>
  <section id="instalar" class="border-border border-t">
    <div class="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <h2 class="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">Como instalar</h2>
      <div class="text-lg leading-relaxed">
        <p>
          No Chrome, no Edge e no Brave, abra a página do Pixima na Chrome Web Store e clique em Adicionar. O Edge e o
          Brave também instalam extensões dessa loja.
        </p>
        <a
          :href="links.chromeStore"
          class="bg-primary text-primary-foreground mt-6 inline-block rounded-md px-5 py-3 text-[15px] font-medium transition hover:brightness-110"
        >
          Abrir na Chrome Web Store
        </a>
        <p class="text-muted-foreground mt-10">
          No Firefox, o Pixima ainda não está no Firefox Add-ons. Por enquanto a instalação é manual, a partir do código
          no GitHub, e o passo a passo está no README.
        </p>
        <p class="mt-3">
          <a :href="links.installManual" class="text-primary underline underline-offset-4">Ver o passo a passo para o Firefox</a>
        </p>
      </div>
    </div>
  </section>
</template>
