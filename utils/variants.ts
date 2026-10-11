import type { ScannedImage } from '@/shared/types';

const SIZE_SEGMENT =
  /^(thumb|thumbnail|small|medium|large|big|original|full|xl|xs|sm|md|lg|newsletter|preview|square|mini|tiny|retina|resized|display|detail|\d+x\d+|[wh]_?\d+|\d+[wh])(_[a-z0-9]+)?$/i;

const SIZE_PARAMS = new Set([
  'w',
  'h',
  'width',
  'height',
  'size',
  'quality',
  'q',
  'fit',
  'resize',
  'crop',
  'dpr',
  'format',
  'fm',
  'auto',
]);

const INTERFACE_NAME =
  /(^|[-_/.])(logo|loader|loading|spinner|sprite|sprites|icon|icons|avatar|arrow|arrows|badge|favicon|pixel|tracking|blank|spacer|placeholder|button|btn|wordmark|tagline)([-_.\d/]|$)/i;

const TRACKER_PATH =
  /(gen_204|\/pixel(\.|\/|$)|beacon|\/collect(\/|$)|\/track(ing|er)?(\/|\.|$)|analytics|\/ping(\/|$)|\/impression|\/b\/ss\/)/i;

const TRACKER_HOST =
  /(^|\.)(doubleclick\.net|googlesyndication\.com|googleadservices\.com|google-analytics\.com|googletagmanager\.com|googletagservices\.com|2mdn\.net|adnxs\.com|adsrvr\.org|criteo\.(com|net)|scorecardresearch\.com|taboola\.com|outbrain\.com|pubmatic\.com|rubiconproject\.com|amazon-adsystem\.com|adform\.net|moatads\.com|demdex\.net|bat\.bing\.com|connect\.facebook\.net|hotjar\.com|clarity\.ms)$/i;

const TRACKER_MAX_SIDE = 4;

const MEDIA_SUBDOMAIN = /^(thumb|thumbs|upload|img|images|cdn|media|static)\./i;

const QUALITY_HINT = /(original|full|large|big|xl|2048|1600|1200|hires|high)/i;

export function variantKey(url: string) {
  if (!/^https?:/.test(url)) return url;
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const file = segments.pop() ?? '';
    const rawName = file.replace(/^\d+px-/i, '');
    let folders = segments.filter((segment) => !SIZE_SEGMENT.test(segment));
    if (rawName !== file && folders[folders.length - 1] === rawName) folders = folders.slice(0, -1);
    const name = rawName
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/[-_]\d+x\d+$/i, '')
      .replace(/@\dx$/i, '');
    const params = [...parsed.searchParams]
      .filter(([key]) => !SIZE_PARAMS.has(key.toLowerCase()) && !/^utm_/i.test(key))
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('&');
    return `${parsed.host.replace(MEDIA_SUBDOMAIN, '')}/${folders.join('/')}/${name}?${params}`;
  } catch {
    return url;
  }
}

function score(image: ScannedImage) {
  return image.width * image.height * 10 + (QUALITY_HINT.test(image.url) ? 1 : 0);
}

export function groupVariants(images: ScannedImage[]) {
  const best = new Map<string, ScannedImage>();
  const order: string[] = [];
  for (const image of images) {
    const key = variantKey(image.url);
    const current = best.get(key);
    if (!current) {
      best.set(key, image);
      order.push(key);
    } else if (score(image) > score(current)) {
      best.set(key, image);
    }
  }
  const items = order.map((key) => best.get(key) as ScannedImage);
  return { items, hidden: images.length - items.length };
}

export function effectiveKind(image: ScannedImage): ScannedImage['kind'] {
  if (image.kind === 'icon') return 'icon';
  if (image.url.startsWith('data:')) return image.kind;
  try {
    return INTERFACE_NAME.test(new URL(image.url).pathname) ? 'icon' : image.kind;
  } catch {
    return image.kind;
  }
}

export function isTracker(image: ScannedImage) {
  if (image.url.startsWith('data:')) return false;
  if (image.width && image.height && Math.max(image.width, image.height) <= TRACKER_MAX_SIDE) {
    return true;
  }
  try {
    const { hostname, pathname } = new URL(image.url);
    return TRACKER_HOST.test(hostname) || TRACKER_PATH.test(pathname);
  } catch {
    return false;
  }
}
