import type { Component } from 'vue';
import { Download, Filter, Layers, Search, ShieldCheck, SlidersHorizontal } from '@lucide/vue';

export const links = {
  repo: 'https://github.com/rodrigueskaua/pixima',
  install: 'https://github.com/rodrigueskaua/pixima#instalação',
  issues: 'https://github.com/rodrigueskaua/pixima/issues',
  license: 'https://github.com/rodrigueskaua/pixima/blob/main/LICENSE',
  creativeCommons: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br',
};

export interface Feature {
  title: string;
  text: string;
  icon: Component;
  wide?: boolean;
  full?: boolean;
}

export const features: Feature[] = [
  {
    title: 'Acha tudo da página',
    text: 'Fotos, fundos, SVGs, capas de vídeo e até as imagens que o site só carrega depois. Tudo numa lista só, sem você caçar no código.',
    icon: Search,
    wide: true,
  },
  {
    title: 'Sem repetição',
    text: 'Quando o site tem miniatura, tamanho médio e grande da mesma foto, o Pixima mostra só a maior.',
    icon: Layers,
  },
  {
    title: 'Sem lixo',
    text: 'Anúncios, rastreadores e itens de interface, como logos e ícones, ficam de fora da lista.',
    icon: Filter,
  },
  {
    title: 'Filtros que ajudam',
    text: 'Filtre por tamanho, formato e orientação e ordene como preferir. Shift seleciona um intervalo.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Converte ao baixar',
    text: 'PNG, JPG ou WebP, com a qualidade que você escolher. Baixe uma ou várias em um ZIP, com o nome original ou numeradas.',
    icon: Download,
  },
  {
    title: 'Privado de verdade',
    text: 'Sem conta e sem servidor. A busca, a conversão e o ZIP acontecem no seu navegador.',
    icon: ShieldCheck,
    full: true,
  },
];

export const steps = [
  {
    title: 'Abra o Pixima',
    text: 'Entre em qualquer site e clique no ícone do Pixima na barra do navegador.',
  },
  {
    title: 'Escolha as imagens',
    text: 'Toque nas que quiser. Se não marcar nenhuma, o Pixima pega todas.',
  },
  {
    title: 'Baixe',
    text: 'Clique em Baixar. Para mudar o formato ou o nome dos arquivos, use a engrenagem ao lado.',
  },
];

export const trust = ['Gratuito', 'Código aberto (MIT)', 'Sem conta', 'Sem rastreamento'];

export const faq = [
  {
    question: 'Em quais navegadores funciona?',
    answer:
      'Nos baseados no Chromium, como Chrome, Edge e Brave, onde ele abre como painel lateral, e no Firefox, onde abre como barra lateral.',
  },
  {
    question: 'É gratuito?',
    answer: 'Sim. O Pixima é gratuito e de código aberto, com licença MIT.',
  },
  {
    question: 'As minhas imagens passam por algum servidor?',
    answer:
      'Não. A busca, a conversão e a criação do ZIP acontecem no seu navegador. O Pixima não tem servidor, conta nem rastreamento.',
  },
  {
    question: 'Por que ele pede acesso a todos os sites?',
    answer:
      'Porque você pode abrir o Pixima em qualquer site, e ele precisa ler as imagens daquela página e baixar arquivos que ficam em outros endereços, como servidores de imagens. Ele só olha a página quando o painel está aberto.',
  },
  {
    question: 'Ele baixa imagens de sites que exigem login?',
    answer:
      'O Pixima baixa o que o seu navegador consegue acessar, e nesse caso usa a sua sessão no site. Respeite os direitos autorais e os termos de cada site.',
  },
  {
    question: 'Como instalo?',
    answer:
      'Ele ainda não está nas lojas. Por enquanto, a instalação é pelo GitHub, com o passo a passo no README.',
  },
];
