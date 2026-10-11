<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#conteudo"
      class="bg-sun text-sun-foreground absolute top-2 -left-96 z-50 rounded-lg px-4 py-2 font-semibold focus:left-3"
    >
      Ir para o conteúdo
    </a>
    <SiteHeader />
    <main id="conteudo" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
