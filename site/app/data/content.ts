import { siBrave, siFirefox, siGooglechrome } from 'simple-icons';

export const links = {
  repo: 'https://github.com/rodrigueskaua/pixima',
  chromeStore: 'https://chromewebstore.google.com/detail/pixima/omdhkbejmhcaoofkpodmfhnajjafjpaf',
  install: 'https://chromewebstore.google.com/detail/pixima/omdhkbejmhcaoofkpodmfhnajjafjpaf',
  installManual: 'https://github.com/rodrigueskaua/pixima#instalação',
  issues: 'https://github.com/rodrigueskaua/pixima/issues',
  license: 'https://github.com/rodrigueskaua/pixima/blob/main/LICENSE',
};

export const browsers = [
  { name: 'Chrome', path: siGooglechrome.path },
  { name: 'Firefox', path: siFirefox.path },
  { name: 'Brave', path: siBrave.path },
];

export interface Showcase {
  id: string;
  title: string;
  text: string;
  points: string[];
  image: 'ver-tudo' | 'filtrar' | 'converter';
  wide?: boolean;
  alt: string;
}

export const showcase: Showcase[] = [
  {
    id: 'recursos',
    title: 'Tudo o que a página tem, numa lista só',
    text: 'Você abre o painel e o Pixima procura as imagens da página: as que aparecem e as que o site só carrega depois.',
    points: [
      'Fotos, fundos de CSS, SVGs e capas de vídeo',
      'Quando a mesma foto aparece em miniatura, tamanho médio e grande, fica só a maior',
      'Anúncios, rastreadores e itens do próprio site, como logos e ícones, ficam de fora',
    ],
    image: 'ver-tudo',
    wide: true,
    alt: 'Painel do Pixima ao lado do artigo da Wikipédia sobre a Apollo 11, listando as imagens da página',
  },
  {
    id: 'filtros',
    title: 'Filtre antes de baixar',
    text: 'Páginas grandes têm muita coisa. Reduza a lista até sobrar só o que você quer.',
    points: [
      'Tamanho mínimo, formato (JPG, PNG, SVG…) e orientação',
      'Ordem da página, por tamanho ou por nome',
      'Um clique seleciona, Shift pega um intervalo e o duplo clique abre a imagem em tamanho maior',
    ],
    image: 'filtrar',
    alt: 'Painel de filtros do Pixima aberto sobre a lista de imagens',
  },
  {
    id: 'converter',
    title: 'Converta na hora de baixar',
    text: 'Não precisa abrir outro programa para trocar o formato.',
    points: [
      'PNG, JPG ou WebP, com a qualidade que você escolher',
      'Mais de uma imagem sai junta num ZIP',
      'Nome original ou numerado, como pixima-001, pixima-002…',
    ],
    image: 'converter',
    alt: 'Painel de exportação do Pixima com as opções de formato, qualidade e nome dos arquivos',
  },
];

export const extras = [
  'Copiar a imagem ou o endereço dela com um clique',
  'Tema claro, escuro ou automático, seguindo o seu sistema',
  'Um tour rápido na primeira vez que você abre o painel',
  'Funciona em abas diferentes: o painel acompanha a página que você está vendo',
];

export const faq = [
  {
    question: 'Em quais navegadores funciona?',
    answer:
      'No Chrome, no Edge e no Brave, onde abre como painel lateral, e no Firefox, onde abre como barra lateral.',
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
      'Baixa o que o seu navegador consegue acessar, e nesse caso usa a sua sessão no site. Respeite os direitos autorais e os termos de cada site.',
  },
];
