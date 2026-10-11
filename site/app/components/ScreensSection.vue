<script setup lang="ts">
import escuro from '@docs/galeria-escuro.png';
import exportar from '@docs/exportar.png';
import filtros from '@docs/filtros.png';
import galeria from '@docs/galeria.png';
import { links } from '~/data/content';

const screens = [
  { src: galeria, caption: 'Galeria', alt: 'Galeria com as imagens do artigo, no tema claro' },
  { src: filtros, caption: 'Filtros', alt: 'Painel de filtros por tamanho, formato, orientação e ordem' },
  { src: exportar, caption: 'Exportar', alt: 'Painel de exportação com formato, qualidade e nome dos arquivos' },
  { src: escuro, caption: 'Tema escuro', alt: 'Galeria no tema escuro' },
];
</script>

<template>
  <section id="telas" class="mx-auto w-full max-w-6xl px-5 py-20">
    <SectionHeading title="Como ele é por dentro" subtitle="Tema claro, escuro ou automático, seguindo o seu sistema." />
    <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <figure v-for="screen in screens" :key="screen.caption">
        <img
          :src="screen.src"
          :alt="screen.alt"
          width="800"
          height="1600"
          loading="lazy"
          class="border-border h-auto w-full rounded-2xl border shadow-[var(--shadow)]"
        >
        <figcaption class="text-muted-foreground mt-3 text-center text-sm">{{ screen.caption }}</figcaption>
      </figure>
    </div>
    <p class="text-muted-foreground mt-8 text-[13px]">
      Capturas feitas na Wikipédia, no artigo sobre a Apollo 11, com imagens de domínio público da NASA. O texto da
      Wikipédia é licenciado sob
      <a :href="links.creativeCommons" class="text-primary underline">CC BY-SA 4.0</a>.
    </p>
  </section>
</template>
