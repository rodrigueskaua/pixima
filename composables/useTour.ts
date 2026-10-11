import { useStorage } from '@vueuse/core';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const STEPS = [
  {
    element: '[data-tour="tabs"]',
    popover: {
      title: 'Filtre por tipo',
      description: 'O Pixima acha imagens, fundos, SVG e mais. Toque numa aba para ver só aquele tipo.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="card"]',
    popover: {
      title: 'Toque para selecionar',
      description:
        'Um toque seleciona, Shift seleciona um intervalo e duplo clique abre a imagem grande. Passe o mouse para copiar ou baixar uma só.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="filters"]',
    popover: {
      title: 'Refine os resultados',
      description: 'Tamanho mínimo, formato, orientação e ordem ficam aqui.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="download"]',
    popover: {
      title: 'Baixe com um toque',
      description:
        'Baixa as imagens selecionadas, ou todas se nenhuma estiver marcada. Mais de uma vira um ZIP.',
      side: 'top' as const,
    },
  },
  {
    element: '[data-tour="export"]',
    popover: {
      title: 'Converta ao baixar',
      description: 'Escolha PNG, JPG ou WebP, a qualidade e o nome dos arquivos.',
      side: 'top' as const,
    },
  },
];

export function useTour() {
  const seen = useStorage('pixima:tour-seen', false);

  function start() {
    const steps = STEPS.filter((step) => document.querySelector(step.element));
    if (!steps.length) return;
    const tour = driver({
      steps,
      showProgress: true,
      progressText: '{{current}} de {{total}}',
      nextBtnText: 'Próximo',
      prevBtnText: 'Voltar',
      doneBtnText: 'Entendi',
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 8,
      popoverClass: 'pixima-tour',
      onDestroyed: () => {
        seen.value = true;
      },
    });
    tour.drive();
  }

  return { seen, start };
}
