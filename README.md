<img src="docs/screenshots/icon.png" alt="Pixima" width="72" height="72">

# Pixima

[![License](https://img.shields.io/github/license/rodrigueskaua/pixima)](LICENSE)
[![Navegadores](https://img.shields.io/badge/navegadores-Chrome%20%7C%20Edge%20%7C%20Brave%20%7C%20Firefox-lightgrey)](#instalação)

**Extensão de navegador que reúne as imagens de qualquer página para copiar, baixar e converter.**

O Pixima abre um painel lateral com todas as imagens da página que você está vendo. Basta selecionar o que quiser e **copiar, baixar uma a uma ou em ZIP e converter para PNG, JPG ou WebP**, com filtros por tipo, tamanho, formato e orientação.

Tudo roda no próprio navegador: **nenhuma imagem passa por servidor**.

<div align="center">
  <img src="docs/screenshots/galeria.png" alt="Painel do Pixima com a galeria de imagens da página, no tema claro" width="280">
  <img src="docs/screenshots/galeria-escuro.png" alt="Painel do Pixima no tema escuro" width="280">
</div>

Capturas com imagens geradas só para o exemplo.

<details>
<summary>Ver mais telas</summary>

<br>

<div align="center">
  <img src="docs/screenshots/selecao.png" alt="Imagens selecionadas e botão de baixar em ZIP" width="280">
  <img src="docs/screenshots/filtros.png" alt="Painel de filtros por tamanho, formato, orientação e ordem" width="280">
  <img src="docs/screenshots/exportar.png" alt="Painel de exportação com formato, qualidade e nome dos arquivos" width="280">
</div>

</details>

## Features

- Veja todas as imagens da página num painel ao lado, sem sair do site
- Acha também as que ficam escondidas: fundos, ícones em SVG, capas de vídeo e imagens que o site carrega depois
- Mostra só a melhor versão de cada imagem, sem repetir miniatura e tamanho médio
- Deixa de fora anúncios, rastreadores e itens de interface, como logos e ícones
- Filtre por tipo, tamanho, formato e orientação, e ordene como preferir
- Selecione várias de uma vez (Shift para um intervalo) e amplie para conferir antes de baixar
- Copie a imagem ou o link com um clique
- Baixe uma imagem ou várias de uma vez em um ZIP
- Converta para PNG, JPG ou WebP ao baixar, escolhendo a qualidade e se os arquivos mantêm o nome original ou são numerados
- Tema claro, escuro ou automático
- Um tour rápido mostra o básico no primeiro uso
- Privado: tudo acontece no seu navegador, sem conta, sem rastreamento e sem enviar nada para servidores

## Como usar

1. Abra qualquer site e clique no ícone do Pixima na barra do navegador
2. Toque nas imagens que quiser, ou deixe nenhuma marcada para pegar todas
3. Clique em **Baixar**. Para mudar o formato ou o nome dos arquivos, use a engrenagem ao lado

## Instalação

O Pixima ainda não está nas lojas. Para usar, gere o build e carregue no navegador:

```sh
git clone https://github.com/rodrigueskaua/pixima.git
cd pixima
npm install
npm run build
npm run build:firefox
```

- **Chrome, Edge e Brave:** abra `chrome://extensions`, ative o modo do desenvolvedor, clique em "Carregar sem compactação" e escolha a pasta `.output/chrome-mv3`.
- **Firefox:** abra `about:debugging#/runtime/this-firefox`, clique em "Carregar extensão temporária" e escolha o arquivo `.output/firefox-mv3/manifest.json`. Depois, em `about:addons`, abra o Pixima, vá em "Permissões" e ative o acesso a todos os sites.

O navegador não permite extensões em páginas internas, na loja de extensões e em alguns arquivos locais, e o Pixima não consegue escanear essas páginas.

## Stack

<a href="https://wxt.dev/" target="_blank">
  <img src="https://img.shields.io/badge/WXT-67D45E?style=for-the-badge&logoColor=white" alt="WXT Badge" />
</a>
<a href="https://vuejs.org/" target="_blank">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue Badge" />
</a>
<a href="https://www.typescriptlang.org/" target="_blank">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
</a>
<a href="https://tailwindcss.com/" target="_blank">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind Badge" />
</a>
<a href="https://vite.dev/" target="_blank">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
</a>
<a href="https://www.shadcn-vue.com/" target="_blank">
  <img src="https://img.shields.io/badge/shadcn--vue-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn-vue Badge" />
</a>

### Bibliotecas complementares

[Reka UI](https://reka-ui.com/) <br>
[Lucide Icons](https://lucide.dev/) <br>
[VueUse](https://vueuse.org/) <br>
[fflate](https://github.com/101arrowz/fflate) <br>
[driver.js](https://driverjs.com/) <br>
[vue-sonner](https://vue-sonner.vercel.app/) <br>
[Inter](https://rsms.me/inter/) <br>

## Roadmap

Em andamento:

- [ ] Publicar na Chrome Web Store e no Firefox Add-ons

Próximos:

- [ ] Menu de botão direito na imagem
- [ ] Modo "inspecionar" para clicar numa imagem direto na página
- [ ] Redimensionar ao exportar
- [ ] Vídeos e áudios
- [ ] Testes automatizados
- [ ] CI no GitHub Actions (tipos, build e pacote das extensões)

## Desenvolvimento

### Pré-requisitos

- Node.js >= 20.19
- npm >= 10

### Instalação

```sh
git clone https://github.com/rodrigueskaua/pixima.git
cd pixima
npm install
```

### Rodar em modo desenvolvimento

```sh
npm run dev
npm run dev:firefox
```

O primeiro abre um Chrome e o segundo um Firefox, ambos com a extensão carregada e recarregando a cada mudança no código.

### Gerar os pacotes

```sh
npm run build
npm run build:firefox
npm run zip
npm run zip:firefox
```

Os builds ficam em `.output/chrome-mv3` e `.output/firefox-mv3`, e os `.zip` para as lojas em `.output/`.
