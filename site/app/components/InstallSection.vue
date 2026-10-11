<script setup lang="ts">
import { links } from '~/data/content';
</script>

<template>
  <section id="instalar" class="border-border border-t">
    <div class="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <h2 class="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">Como instalar</h2>
      <div class="text-lg leading-relaxed">
        <p>
          O Pixima ainda não está na Chrome Web Store nem no Firefox Add-ons, então por enquanto a instalação é manual,
          a partir do código no GitHub. Leva alguns minutos, e o passo a passo está no README.
        </p>
        <p class="text-muted-foreground mt-4">Quando ele estiver nas lojas, os links aparecem aqui.</p>
        <a
          :href="links.install"
          class="bg-primary text-primary-foreground mt-6 inline-block rounded-md px-5 py-3 text-[15px] font-medium transition hover:brightness-110"
        >
          Ver o passo a passo
        </a>
      </div>
    </div>
  </section>
</template>
