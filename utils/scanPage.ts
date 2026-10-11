import type { ImageKind, ScannedImage } from '@/shared/types';

export function scanPage(): ScannedImage[] {
  const MAX_ELEMENTS = 20000;
  const MAX_INLINE_LENGTH = 2_000_000;
  const found = new Map<string, ScannedImage>();
  const transferSizes = new Map<string, number>();
  let visited = 0;

  for (const entry of performance.getEntriesByType('resource') as PerformanceResourceTiming[]) {
    const size = entry.encodedBodySize || entry.decodedBodySize;
    if (size) transferSizes.set(entry.name, size);
  }

  const inlineBytes = (url: string) => {
    const payload = url.slice(url.indexOf(',') + 1);
    return url.slice(0, url.indexOf(',')).includes(';base64')
      ? Math.floor(payload.length * 0.75)
      : payload.length;
  };

  const add = (
    raw: string | null | undefined,
    kind: ImageKind,
    width = 0,
    height = 0,
    alt = '',
    estimated = false,
  ) => {
    if (!raw) return;
    let url: string;
    try {
      url = new URL(raw.trim(), document.baseURI).href;
    } catch {
      return;
    }
    if (!/^(https?:|blob:|data:image\/)/i.test(url)) return;
    if (url.length > MAX_INLINE_LENGTH || found.has(url)) return;
    found.set(url, {
      url,
      kind,
      width: Math.round(width),
      height: Math.round(height),
      bytes: url.startsWith('data:') ? inlineBytes(url) : (transferSizes.get(url) ?? 0),
      alt: alt.trim().slice(0, 200),
      estimated: estimated && width > 0 && height > 0,
    });
  };

  const largestCandidate = (srcset: string) => {
    let best = '';
    let bestScore = -1;
    for (const part of srcset.split(/,\s+/)) {
      const [candidate, descriptor = '1x'] = part.trim().split(/\s+/);
      const score = parseFloat(descriptor) || 1;
      if (candidate && score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
  };

  const serializeSvg = (svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    }
    clone.setAttribute('width', String(Math.round(rect.width)));
    clone.setAttribute('height', String(Math.round(rect.height)));
    clone.style.color = getComputedStyle(svg).color;

    for (const use of clone.querySelectorAll('use')) {
      const href = use.getAttribute('href') || use.getAttribute('xlink:href') || '';
      if (!href.startsWith('#')) continue;
      const id = href.slice(1);
      if (clone.querySelector(`#${CSS.escape(id)}`)) continue;
      const target = document.getElementById(id);
      if (target) clone.prepend(target.cloneNode(true));
    }

    const markup = new XMLSerializer().serializeToString(clone);
    add(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`,
      'svg',
      rect.width,
      rect.height,
      svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent || '',
    );
  };

  const readCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas.width < 16 || canvas.height < 16) return;
    if (canvas.width * canvas.height > 16_000_000) return;
    try {
      add(canvas.toDataURL('image/png'), 'canvas', canvas.width, canvas.height);
    } catch {
      return;
    }
  };

  const readImage = (img: HTMLImageElement) => {
    const loaded = img.naturalWidth > 0 && img.naturalHeight > 0;
    const rect = loaded ? null : img.getBoundingClientRect();
    const width = loaded ? img.naturalWidth : (rect?.width ?? 0);
    const height = loaded ? img.naturalHeight : (rect?.height ?? 0);
    const insidePicture = img.parentElement?.localName === 'picture';
    const fromSrcset = !insidePicture && img.srcset ? largestCandidate(img.srcset) : '';
    if (fromSrcset) {
      add(fromSrcset, 'img', 0, 0, img.alt);
    } else {
      add(img.currentSrc || img.src, 'img', width, height, img.alt, !loaded);
    }
    for (const attribute of ['data-src', 'data-original', 'data-lazy-src', 'data-lazy']) {
      const lazy = img.getAttribute(attribute);
      if (lazy && /^(https?:)?\/\/|^\//.test(lazy)) add(lazy, 'img', width, height, img.alt, true);
    }
    const lazySrcset = img.getAttribute('data-srcset');
    if (lazySrcset) add(largestCandidate(lazySrcset), 'img', 0, 0, img.alt);
  };

  const readBackground = (element: Element) => {
    const value = getComputedStyle(element).backgroundImage;
    if (!value || value === 'none' || !value.includes('url(')) return;
    for (const match of value.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
      add(match[2], 'background', 0, 0, element.getAttribute('aria-label') || '');
    }
  };

  const walk = (root: Document | ShadowRoot) => {
    for (const element of root.querySelectorAll('*')) {
      if (visited++ > MAX_ELEMENTS) return;
      if (element instanceof HTMLImageElement) {
        readImage(element);
      } else if (element instanceof SVGSVGElement) {
        if (!element.ownerSVGElement) serializeSvg(element);
      } else if (element instanceof SVGImageElement) {
        add(element.href.baseVal, 'img');
      } else if (element instanceof HTMLCanvasElement) {
        readCanvas(element);
      } else if (element instanceof HTMLVideoElement) {
        add(element.poster, 'poster', element.videoWidth, element.videoHeight);
      } else if (element instanceof HTMLInputElement && element.type === 'image') {
        add(element.src, 'img', 0, 0, element.alt);
      }
      if (!(element instanceof SVGElement)) readBackground(element);
      if (element.shadowRoot) walk(element.shadowRoot);
    }
  };

  walk(document);

  for (const meta of document.querySelectorAll<HTMLMetaElement>(
    'meta[property="og:image"], meta[property="og:image:secure_url"], meta[name="twitter:image"], meta[name="twitter:image:src"]',
  )) {
    add(meta.content, 'meta');
  }

  return [...found.values()];
}

export async function fetchAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
