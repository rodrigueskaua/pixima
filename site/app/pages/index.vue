<script setup lang="ts">
const { public: site } = useRuntimeConfig();
const base = useRuntimeConfig().app.baseURL;

const title = 'Pixima: baixe as imagens de qualquer site sem clicar em uma por uma';
const description =
  'Extensão para Chrome, Edge, Brave e Firefox que lista as imagens de qualquer site num painel ao lado da página. Selecione, converta para PNG, JPG ou WebP e baixe em ZIP. Gratuita e privada.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: 'Copie, converta para PNG, JPG ou WebP e baixe em ZIP, tudo no seu navegador.',
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogUrl: `${site.siteUrl}/`,
  ogImage: `${site.siteUrl}/og.png`,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: `${site.siteUrl}/` },
    { rel: 'icon', type: 'image/svg+xml', href: `${base}icon.svg` },
    { rel: 'apple-touch-icon', href: `${base}icon.png` },
  ],
});
</script>

<template>
  <div>
    <HeroSection />
    <ShowcaseSection />
    <ExtrasSection />
    <PrivacySection />
    <FaqSection />
    <InstallSection />
  </div>
</template>
