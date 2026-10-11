<script setup lang="ts">
import { links } from '~/data/content';

const { public: site } = useRuntimeConfig();
const base = useRuntimeConfig().app.baseURL;

useSeoMeta({
  title: 'Política de privacidade do Pixima',
  description: 'Política de privacidade da extensão Pixima: nada sai do seu navegador, sem conta e sem rastreamento.',
});

useHead({
  link: [
    { rel: 'canonical', href: `${site.siteUrl}/privacidade` },
    { rel: 'icon', type: 'image/svg+xml', href: `${base}icon.svg` },
  ],
});

const collected = [
  {
    title: 'Páginas que você visita',
    text: 'o Pixima lê o conteúdo da página aberta somente quando você abre o painel, para encontrar as imagens. Esse conteúdo é processado no próprio navegador e não é guardado nem enviado.',
  },
  {
    title: 'Imagens',
    text: 'quando você copia, baixa ou converte uma imagem, o Pixima a busca diretamente no site de origem, como o seu navegador faria, inclusive usando a sua sessão nesse site quando a imagem exige login. A conversão e a criação do ZIP acontecem no seu computador.',
  },
  {
    title: 'Preferências',
    text: 'o formato escolhido, a qualidade, o tema e a ordem dos itens ficam salvos apenas no armazenamento local do navegador, no seu computador.',
  },
];

const notDone = [
  'Não coleta dados pessoais',
  'Não registra o que você visita',
  'Não cria cookies e não usa rastreadores, anúncios nem ferramentas de análise',
  'Não vende, compartilha ou transfere dados',
];

const permissions = [
  { title: 'Acesso aos sites', text: 'necessário para encontrar e baixar as imagens da página em que você abre o painel' },
  { title: 'Scripting', text: 'executa a busca de imagens na página' },
  { title: 'Downloads', text: 'salva no computador as imagens e o ZIP que você escolher' },
  { title: 'Painel lateral', text: 'mostra a interface ao lado da página' },
  { title: 'Aba ativa (somente no Firefox)', text: 'acesso temporário à aba em que você clica no ícone' },
];
</script>

<template>
  <article class="mx-auto w-full max-w-3xl px-5 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight">Política de privacidade do Pixima</h1>
    <p class="text-muted-foreground mt-2 text-sm">Última atualização: outubro de 2026</p>
    <p class="mt-6 text-lg">
      O Pixima é uma extensão de navegador que mostra as imagens da página que você está vendo para você copiar,
      baixar e converter.
    </p>

    <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight">O que o Pixima faz com os seus dados</h2>
    <p><strong>Nada sai do seu navegador.</strong> O Pixima não tem servidor, não tem conta e não envia nenhuma informação para o autor nem para terceiros.</p>
    <ul class="mt-4 grid list-disc gap-2.5 pl-6">
      <li v-for="item in collected" :key="item.title"><strong>{{ item.title }}:</strong> {{ item.text }}</li>
    </ul>

    <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight">O que o Pixima não faz</h2>
    <ul class="grid list-disc gap-2 pl-6">
      <li v-for="item in notDone" :key="item">{{ item }}</li>
    </ul>

    <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight">Permissões</h2>
    <ul class="grid list-disc gap-2 pl-6">
      <li v-for="item in permissions" :key="item.title"><strong>{{ item.title }}:</strong> {{ item.text }}</li>
    </ul>

    <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight">Contato</h2>
    <p>
      Dúvidas ou pedidos: abra uma issue em
      <a :href="links.issues" class="text-primary underline">github.com/rodrigueskaua/pixima/issues</a>.
    </p>

    <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight">Mudanças</h2>
    <p>Se esta política mudar, a nova versão será publicada neste endereço, com a data atualizada.</p>
  </article>
</template>
