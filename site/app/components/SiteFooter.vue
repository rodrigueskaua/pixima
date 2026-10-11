<script setup lang="ts">
import { links } from '~/data/content';
</script>

<template>
  <footer class="border-border text-muted-foreground border-t py-10 text-sm">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5">
      <span>Pixima, por Kauã Rodrigues. Licença <a :href="links.license" class="underline">MIT</a>.</span>
      <nav class="flex gap-5" aria-label="Rodapé">
        <a :href="links.repo" class="hover:text-foreground">GitHub</a>
        <a :href="links.issues" class="hover:text-foreground">Suporte</a>
        <NuxtLink to="/privacidade" class="hover:text-foreground">Privacidade</NuxtLink>
      </nav>
    </div>
  </footer>
</template>
