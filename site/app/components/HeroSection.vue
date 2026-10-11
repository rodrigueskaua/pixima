<script setup lang="ts">
import hero from '~/assets/img/hero.webp';
import heroPainel from '~/assets/img/hero-painel.webp';
import { browsers, links } from '~/data/content';
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-5 pt-16 pb-20 text-center sm:pt-24">
    <h1 class="mx-auto max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
      Baixe as imagens de qualquer site sem clicar em uma por uma
    </h1>
    <p class="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
      O Pixima abre um painel ao lado da página com todas as imagens dela. Você marca as que quer, escolhe o formato
      (PNG, JPG ou WebP) e baixa. Se forem várias, saem juntas num ZIP.
    </p>

    <div class="mt-9 flex flex-wrap justify-center gap-3">
      <a
        :href="links.install"
        class="bg-primary text-primary-foreground rounded-md px-5 py-3 text-[15px] font-medium transition hover:brightness-110"
      >
        Instalar
      </a>
      <a
        :href="links.repo"
        class="border-border hover:bg-muted rounded-md border px-5 py-3 text-[15px] font-medium transition-colors"
      >
        Ver o código
      </a>
    </div>

    <p class="text-muted-foreground mt-5 text-sm">
      Gratuito, de código aberto e sem conta. Ainda não está nas lojas: a instalação é pelo GitHub.
    </p>

    <ul class="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <li class="text-muted-foreground/80">Funciona no</li>
      <li v-for="browser in browsers" :key="browser.name" class="flex items-center gap-2">
        <BrowserLogo :path="browser.path" />
        {{ browser.name }}
      </li>
      <li class="text-muted-foreground/80">e no Edge</li>
    </ul>

    <div class="border-border mx-auto mt-14 max-w-5xl overflow-hidden rounded-xl border shadow-[var(--shadow)] sm:max-w-5xl max-sm:max-w-[420px]">
      <img
        :src="hero"
        width="1920"
        height="1200"
        alt="O Pixima aberto ao lado do artigo da Wikipédia sobre a Apollo 11, com três imagens selecionadas para baixar"
        class="hidden h-auto w-full sm:block"
      >
      <img
        :src="heroPainel"
        width="600"
        height="1200"
        alt="O Pixima com três imagens selecionadas para baixar"
        loading="lazy"
        class="mx-auto h-auto w-full max-w-[420px] sm:hidden"
      >
    </div>
  </section>
</template>
