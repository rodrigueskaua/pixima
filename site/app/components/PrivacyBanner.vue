<script setup lang="ts">
import { Check } from '@lucide/vue';

const points = [
  'Sem conta e sem cadastro',
  'Sem rastreadores, anúncios ou análise de uso',
  'Nenhuma imagem é enviada para servidores',
  'Preferências salvas só no seu navegador',
];
</script>

<template>
  <section id="privacidade" class="mx-auto w-full max-w-6xl px-5 py-20">
    <div
      class="bg-header text-header-foreground grid items-center gap-10 rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]"
    >
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Nada sai do seu navegador</h2>
        <p class="mt-4 max-w-xl text-lg opacity-85">
          O Pixima não tem servidor nem conta. Ele só lê a página quando você abre o painel, e tudo o que faz com as
          imagens acontece no seu computador.
        </p>
        <NuxtLink to="/privacidade" class="text-sun mt-6 inline-block font-semibold underline underline-offset-4">
          Ler a política de privacidade
        </NuxtLink>
      </div>
      <ul class="grid gap-3.5">
        <li v-for="point in points" :key="point" class="flex items-start gap-3">
          <span class="bg-sun text-sun-foreground mt-0.5 grid size-5 shrink-0 place-items-center rounded-full">
            <Check class="size-3" stroke-width="4" />
          </span>
          {{ point }}
        </li>
      </ul>
    </div>
  </section>
</template>
