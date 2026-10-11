<script setup lang="ts">
import { links } from '~/data/content';
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-5 pb-24">
    <div class="border-border bg-card rounded-3xl border px-6 py-14 text-center sm:px-12">
      <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Experimente o Pixima</h2>
      <p class="text-muted-foreground mx-auto mt-3 max-w-xl text-lg">
        Gratuito, de código aberto e sem conta. Instale em poucos minutos.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          :href="links.install"
          class="bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-[15px] font-semibold transition hover:brightness-110"
        >
          Instalar pelo GitHub
        </a>
        <span
          class="border-border text-muted-foreground cursor-not-allowed rounded-xl border border-dashed px-6 py-3.5 text-[15px] font-semibold"
        >
          Chrome Web Store, em breve
        </span>
        <span
          class="border-border text-muted-foreground cursor-not-allowed rounded-xl border border-dashed px-6 py-3.5 text-[15px] font-semibold"
        >
          Firefox Add-ons, em breve
        </span>
      </div>
    </div>
  </section>
</template>
