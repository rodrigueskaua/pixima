import type { Ref } from 'vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { browser } from 'wxt/browser';
import type { OutputOptions, PageInfo, ScannedImage } from '@/shared/types';
import {
  baseName,
  downloadBlob,
  fileExtension,
  prepareClipboardImage,
  prepareImage,
  runPool,
  zipFiles,
} from '@/utils/images';

const PARALLEL_DOWNLOADS = 6;

export function useImageActions(page: Ref<PageInfo | null>, options: OutputOptions) {
  const progress = ref<{ done: number; total: number } | null>(null);

  function requireTabId() {
    if (!page.value) throw new Error('no-page');
    return page.value.tabId;
  }

  function archiveName() {
    try {
      const host = new URL(page.value?.url ?? '').hostname || 'imagens';
      return `pixima-${host}-${new Date().toISOString().slice(0, 10)}.zip`;
    } catch {
      return 'pixima-imagens.zip';
    }
  }

  function nameFor(image: ScannedImage, index: number) {
    if (options.naming === 'sequence') return `pixima-${String(index + 1).padStart(3, '0')}`;
    return baseName(image, index);
  }

  async function copyImage(image: ScannedImage) {
    try {
      const png = prepareClipboardImage(image, requireTabId());
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
      toast.success('Imagem copiada');
    } catch {
      toast.error('Não foi possível copiar esta imagem');
    }
  }

  async function copyUrl(image: ScannedImage) {
    try {
      await navigator.clipboard.writeText(image.url);
      toast.success('Endereço copiado');
    } catch {
      toast.error('Não foi possível copiar o endereço');
    }
  }

  async function openInTab(image: ScannedImage) {
    try {
      const blob = image.url.startsWith('data:')
        ? await prepareImage(image, { format: 'original', quality: 100 }, requireTabId())
        : null;
      await browser.tabs.create({ url: blob ? URL.createObjectURL(blob) : image.url });
    } catch {
      toast.error('Não foi possível abrir esta imagem');
    }
  }

  async function downloadOne(image: ScannedImage, index = 0) {
    try {
      const blob = await prepareImage(image, options, requireTabId());
      await downloadBlob(blob, `${nameFor(image, index)}.${fileExtension(blob, image)}`);
    } catch {
      toast.error('Não foi possível baixar esta imagem');
    }
  }

  async function downloadMany(images: ScannedImage[]) {
    if (progress.value || !images.length) return;
    if (images.length === 1) {
      progress.value = { done: 0, total: 1 };
      await downloadOne(images[0] as ScannedImage);
      progress.value = null;
      return;
    }

    progress.value = { done: 0, total: images.length };
    const files: Record<string, Uint8Array> = {};
    const usedNames = new Set<string>();
    let failed = 0;

    try {
      const tabId = requireTabId();
      await runPool(images, PARALLEL_DOWNLOADS, async (image, index) => {
        try {
          const blob = await prepareImage(image, options, tabId);
          const extension = fileExtension(blob, image);
          const name = nameFor(image, index);
          let filename = `${name}.${extension}`;
          for (let copy = 2; usedNames.has(filename.toLowerCase()); copy++) {
            filename = `${name}-${copy}.${extension}`;
          }
          usedNames.add(filename.toLowerCase());
          files[filename] = new Uint8Array(await blob.arrayBuffer());
        } catch {
          failed++;
        } finally {
          if (progress.value) progress.value.done++;
        }
      });

      const saved = Object.keys(files).length;
      if (!saved) {
        toast.error('Nenhuma imagem pôde ser baixada');
        return;
      }
      await downloadBlob(await zipFiles(files), archiveName());
      if (failed) {
        toast.warning(`${saved} imagens no ZIP, ${failed} não puderam ser baixadas`);
      } else {
        toast.success(`${saved} imagens no ZIP`);
      }
    } catch {
      toast.error('Não foi possível gerar o ZIP');
    } finally {
      progress.value = null;
    }
  }

  return { progress, copyImage, copyUrl, openInTab, downloadOne, downloadMany };
}
