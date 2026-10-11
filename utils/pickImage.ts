export function pickImage() {
  const scope = globalThis as unknown as Record<string, any>;
  const runtime = scope.browser?.runtime ?? scope.chrome?.runtime;
  scope.__piximaPicker?.cancel(false);

  const MAX_INLINE_LENGTH = 2_000_000;
  const MAX_CANVAS_PIXELS = 16_000_000;
  const ACCENT = '#38bdf8';
  const NAVY = '#102a43';
  const STACK = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';

  const apply = (element: HTMLElement, rules: Record<string, string>) => {
    for (const [property, value] of Object.entries(rules)) {
      element.style.setProperty(property, value, 'important');
    }
  };

  const host = document.createElement('div');
  host.id = 'pixima-picker-host';
  apply(host, {
    all: 'initial',
    position: 'fixed',
    inset: '0',
    'z-index': '2147483647',
    'pointer-events': 'none',
  });
  const shadow = host.attachShadow({ mode: 'closed' });

  const box = document.createElement('div');
  apply(box, {
    position: 'fixed',
    display: 'none',
    'box-sizing': 'border-box',
    border: `2px solid ${ACCENT}`,
    background: 'rgba(56,189,248,0.18)',
    'border-radius': '4px',
    'box-shadow': '0 0 0 9999px rgba(16,42,67,0.35)',
    'pointer-events': 'none',
  });

  const tag = document.createElement('div');
  apply(tag, {
    position: 'fixed',
    display: 'none',
    background: NAVY,
    color: '#fff',
    font: `600 11px/1 ${STACK}`,
    padding: '5px 8px',
    'border-radius': '6px',
    'white-space': 'nowrap',
    'pointer-events': 'none',
  });

  const bar = document.createElement('div');
  apply(bar, {
    position: 'fixed',
    top: '14px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    'align-items': 'center',
    gap: '12px',
    background: NAVY,
    color: '#fff',
    font: `500 13px/1.2 ${STACK}`,
    padding: '9px 10px 9px 16px',
    'border-radius': '999px',
    'box-shadow': '0 8px 30px rgba(0,0,0,0.35)',
    'pointer-events': 'auto',
  });
  const message = document.createElement('span');
  message.textContent = 'Clique na imagem que você quer pegar';
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancelar';
  apply(cancelButton, {
    all: 'unset',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.16)',
    color: '#fff',
    font: `600 12px/1 ${STACK}`,
    padding: '7px 12px',
    'border-radius': '999px',
  });
  bar.append(message, cancelButton);
  shadow.append(box, tag, bar);
  document.documentElement.append(host);

  let sheet: CSSStyleSheet | undefined;
  let previousCursor = '';
  try {
    sheet = new CSSStyleSheet();
    sheet.replaceSync('*{cursor:crosshair !important}');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    sheet = undefined;
    previousCursor = document.documentElement.style.cursor;
    document.documentElement.style.setProperty('cursor', 'crosshair', 'important');
  }

  const absolute = (raw: string) => {
    try {
      const url = new URL(raw.trim(), document.baseURI).href;
      if (url.length > MAX_INLINE_LENGTH) return '';
      return /^(https?:|blob:|data:image\/)/i.test(url) ? url : '';
    } catch {
      return '';
    }
  };

  const serializeSvg = (svg: SVGSVGElement, rect: DOMRect) => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
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
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
  };

  interface Found {
    url: string;
    kind: 'img' | 'background' | 'svg' | 'canvas' | 'poster';
    width: number;
    height: number;
    alt: string;
    estimated: boolean;
    rect: DOMRect;
  }

  const describe = (element: Element): Found | null => {
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;

    if (element instanceof HTMLImageElement) {
      const url = absolute(element.currentSrc || element.src);
      if (!url) return null;
      const loaded = element.naturalWidth > 0 && element.naturalHeight > 0;
      return {
        url,
        kind: 'img',
        width: Math.round(loaded ? element.naturalWidth : rect.width),
        height: Math.round(loaded ? element.naturalHeight : rect.height),
        alt: element.alt,
        estimated: !loaded,
        rect,
      };
    }

    if (element instanceof HTMLVideoElement) {
      const url = absolute(element.poster);
      if (!url) return null;
      return {
        url,
        kind: 'poster',
        width: element.videoWidth || Math.round(rect.width),
        height: element.videoHeight || Math.round(rect.height),
        alt: '',
        estimated: !element.videoWidth,
        rect,
      };
    }

    if (element instanceof HTMLCanvasElement) {
      if (element.width * element.height > MAX_CANVAS_PIXELS) return null;
      try {
        const url = absolute(element.toDataURL('image/png'));
        return url
          ? { url, kind: 'canvas', width: element.width, height: element.height, alt: '', estimated: false, rect }
          : null;
      } catch {
        return null;
      }
    }

    if (element instanceof SVGElement) {
      if (element instanceof SVGImageElement) {
        const url = absolute(element.href.baseVal);
        return url ? { url, kind: 'img', width: Math.round(rect.width), height: Math.round(rect.height), alt: '', estimated: true, rect } : null;
      }
      const root = element instanceof SVGSVGElement ? element : element.ownerSVGElement;
      if (!root || root.ownerSVGElement) return null;
      const rootRect = root.getBoundingClientRect();
      if (rootRect.width < 2 || rootRect.height < 2) return null;
      const url = absolute(serializeSvg(root, rootRect));
      return url
        ? {
            url,
            kind: 'svg',
            width: Math.round(rootRect.width),
            height: Math.round(rootRect.height),
            alt: root.getAttribute('aria-label') || '',
            estimated: false,
            rect: rootRect,
          }
        : null;
    }

    if (element === document.documentElement || element === document.body) return null;
    const background = getComputedStyle(element).backgroundImage;
    const match = background && background !== 'none' ? background.match(/url\((['"]?)(.*?)\1\)/) : null;
    const url = match ? absolute(match[2] ?? '') : '';
    if (!url) return null;
    return {
      url,
      kind: 'background',
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      alt: element.getAttribute('aria-label') || '',
      estimated: true,
      rect,
    };
  };

  const stackAt = (root: Document | ShadowRoot, x: number, y: number): Element[] => {
    const result: Element[] = [];
    for (const element of root.elementsFromPoint(x, y)) {
      if (element === host) continue;
      if (element.shadowRoot) result.push(...stackAt(element.shadowRoot, x, y));
      result.push(element);
    }
    return result;
  };

  const resolveAt = (x: number, y: number) => {
    for (const element of stackAt(document, x, y)) {
      const found = describe(element);
      if (found) return found;
    }
    return null;
  };

  const place = (found: Found | null) => {
    if (!found) {
      box.style.setProperty('display', 'none', 'important');
      tag.style.setProperty('display', 'none', 'important');
      return;
    }
    const { rect } = found;
    apply(box, {
      display: 'block',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    tag.textContent = found.estimated ? 'Imagem' : `${found.width} × ${found.height}`;
    const below = rect.bottom + 34 < window.innerHeight;
    apply(tag, {
      display: 'block',
      left: `${Math.max(6, rect.left)}px`,
      top: `${below ? rect.bottom + 6 : Math.max(6, rect.top - 28)}px`,
    });
  };

  let frame = 0;
  const onMove = (event: MouseEvent) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => place(resolveAt(event.clientX, event.clientY)));
  };

  const cleanup = () => {
    cancelAnimationFrame(frame);
    for (const type of ['mousemove', 'click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'auxclick', 'contextmenu', 'keydown', 'scroll']) {
      window.removeEventListener(type, handlers[type] as EventListener, true);
    }
    host.remove();
    if (sheet) document.adoptedStyleSheets = document.adoptedStyleSheets.filter((item) => item !== sheet);
    else document.documentElement.style.cursor = previousCursor;
    delete scope.__piximaPicker;
  };

  const cancel = (notify = true) => {
    cleanup();
    if (notify) runtime?.sendMessage({ type: 'pixima:pick-cancelled' }).catch(() => undefined);
  };

  const swallow = (event: Event) => {
    if (event.composedPath().includes(host)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  const onClick = (event: MouseEvent) => {
    if (event.composedPath().includes(host)) return;
    swallow(event);
    const found = resolveAt(event.clientX, event.clientY);
    if (!found) return;
    const { rect: _rect, ...image } = found;
    cleanup();
    runtime?.sendMessage({ type: 'pixima:picked', image: { ...image, bytes: 0 } }).catch(() => undefined);
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    cancel();
  };

  const onScroll = () => place(null);

  const handlers: Record<string, unknown> = {
    mousemove: onMove,
    click: onClick,
    mousedown: swallow,
    mouseup: swallow,
    pointerdown: swallow,
    pointerup: swallow,
    auxclick: swallow,
    contextmenu: swallow,
    keydown: onKey,
    scroll: onScroll,
  };
  for (const [type, handler] of Object.entries(handlers)) {
    window.addEventListener(type, handler as EventListener, true);
  }

  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    cancel();
  });

  scope.__piximaPicker = { cancel };
}

export function cancelPick() {
  (globalThis as unknown as Record<string, any>).__piximaPicker?.cancel(false);
}
