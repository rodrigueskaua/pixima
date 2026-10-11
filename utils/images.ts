import { zip } from 'fflate';
import { browser } from 'wxt/browser';
import type { OutputFormat, OutputOptions, ScannedImage } from '@/shared/types';
import { fetchAsDataUrl } from '@/utils/scanPage';

type ConvertibleFormat = Exclude<OutputFormat, 'original'>;

const MIME_BY_FORMAT: Record<ConvertibleFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/apng': 'apng',
  'image/tiff': 'tiff',
};

const KNOWN_EXTENSIONS = new Set(Object.values(EXTENSION_BY_MIME));
const FALLBACK_SIZE = 512;
const REVOKE_DELAY = 60_000;

export function guessExtension(url: string) {
  if (url.startsWith('data:')) {
    const mime = url.slice(5, url.search(/[;,]/)).toLowerCase();
    return EXTENSION_BY_MIME[mime] ?? '';
  }
  try {
    const match = new URL(url).pathname.match(/\.([a-z0-9]{2,5})$/i);
    const extension = (match?.[1] ?? '').toLowerCase().replace('jpeg', 'jpg');
    return KNOWN_EXTENSIONS.has(extension) ? extension : '';
  } catch {
    return '';
  }
}

export function formatOf(image: ScannedImage) {
  const extension = guessExtension(image.url);
  if (extension) return extension;
  if (image.kind === 'svg') return 'svg';
  if (image.kind === 'canvas') return 'png';
  return 'outro';
}

export function baseName(image: ScannedImage, index: number) {
  const fallback = `imagem-${index + 1}`;
  if (!/^https?:/.test(image.url)) return fallback;
  try {
    const segment = new URL(image.url).pathname.split('/').filter(Boolean).pop() ?? '';
    const name = decodeURIComponent(segment)
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/[^\p{L}\p{N}\-_. ]+/gu, '_')
      .trim()
      .slice(0, 80);
    return name || fallback;
  } catch {
    return fallback;
  }
}

export function formatBytes(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fetchImageBlob(url: string, tabId: number): Promise<Blob> {
  try {
    const response = await fetch(url, { credentials: 'include', referrerPolicy: 'no-referrer' });
    if (!response.ok) throw new Error(String(response.status));
    return await response.blob();
  } catch {
    const [injection] = await browser.scripting.executeScript({
      target: { tabId },
      func: fetchAsDataUrl,
      args: [url],
    });
    if (typeof injection?.result !== 'string') throw new Error('unreachable');
    return (await fetch(injection.result)).blob();
  }
}

function loadImage(blob: Blob): Promise<{ image: HTMLImageElement; release: () => void }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    const release = () => URL.revokeObjectURL(objectUrl);
    image.onload = () => resolve({ image, release });
    image.onerror = () => {
      release();
      reject(new Error('decode'));
    };
    image.src = objectUrl;
  });
}

export async function encodeBlob(
  blob: Blob,
  format: ConvertibleFormat,
  quality: number,
  fallback: { width: number; height: number },
): Promise<Blob> {
  const type = MIME_BY_FORMAT[format];
  const { image, release } = await loadImage(blob);
  try {
    const width = image.naturalWidth || fallback.width || FALLBACK_SIZE;
    const height = image.naturalHeight || fallback.height || FALLBACK_SIZE;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas');
    if (format === 'jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    return await canvas.convertToBlob({ type, quality });
  } finally {
    release();
  }
}

async function fetchSource(image: ScannedImage, tabId: number): Promise<Blob> {
  const blob = await fetchImageBlob(image.url, tabId);
  if (!blob.type.startsWith('image/') && guessExtension(image.url) === 'svg') {
    return new Blob([blob], { type: 'image/svg+xml' });
  }
  return blob;
}

export async function prepareImage(
  image: ScannedImage,
  options: Pick<OutputOptions, 'format' | 'quality'>,
  tabId: number,
): Promise<Blob> {
  const blob = await fetchSource(image, tabId);
  if (options.format === 'original' || blob.type === MIME_BY_FORMAT[options.format]) return blob;
  return encodeBlob(blob, options.format, options.quality / 100, image);
}

export async function prepareClipboardImage(image: ScannedImage, tabId: number): Promise<Blob> {
  return encodeBlob(await fetchSource(image, tabId), 'png', 1, image);
}

export function fileExtension(blob: Blob, image: ScannedImage) {
  return EXTENSION_BY_MIME[blob.type] ?? (guessExtension(image.url) || 'img');
}

export async function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    await browser.downloads.download({ url: objectUrl, filename });
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), REVOKE_DELAY);
  }
}

export function zipFiles(files: Record<string, Uint8Array>): Promise<Blob> {
  return new Promise((resolve, reject) => {
    zip(files, { level: 0 }, (error, data) => {
      if (error) reject(error);
      else resolve(new Blob([data as Uint8Array<ArrayBuffer>], { type: 'application/zip' }));
    });
  });
}

export async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let cursor = 0;
  const next = async (): Promise<void> => {
    const index = cursor++;
    if (index >= items.length) return;
    await worker(items[index] as T, index);
    return next();
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
}
