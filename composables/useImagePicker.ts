import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { browser } from 'wxt/browser';
import type { PageInfo, ScannedImage } from '@/shared/types';
import { cancelPick, pickImage } from '@/utils/pickImage';

interface PickerMessage {
  type?: string;
  image?: ScannedImage;
}

export function useImagePicker(page: Ref<PageInfo | null>, onPicked: (image: ScannedImage) => void) {
  const picking = ref(false);

  async function stopInPage() {
    const tabId = page.value?.tabId;
    if (!tabId) return;
    try {
      await browser.scripting.executeScript({
        target: { tabId, allFrames: true },
        func: cancelPick,
      });
    } catch {
      return;
    }
  }

  async function start() {
    const tabId = page.value?.tabId;
    if (!tabId || picking.value) return;
    try {
      await browser.scripting.executeScript({
        target: { tabId, allFrames: true },
        func: pickImage,
      });
      picking.value = true;
    } catch {
      toast.error('Não foi possível ativar a seleção nesta página');
    }
  }

  async function cancel() {
    const wasPicking = picking.value;
    picking.value = false;
    if (wasPicking) await stopInPage();
  }

  function toggle() {
    return picking.value ? cancel() : start();
  }

  function onMessage(message: unknown, sender: { tab?: { id?: number } }) {
    const data = message as PickerMessage | undefined;
    if (!data?.type?.startsWith('pixima:pick')) return;
    if (sender.tab?.id !== page.value?.tabId) return;
    if (data.type === 'pixima:picked' && data.image) {
      picking.value = false;
      stopInPage();
      onPicked(data.image);
    } else if (data.type === 'pixima:pick-cancelled') {
      picking.value = false;
    }
  }

  onMounted(() => browser.runtime.onMessage.addListener(onMessage));
  onBeforeUnmount(() => {
    browser.runtime.onMessage.removeListener(onMessage);
    cancel();
  });

  return { picking, toggle, cancel };
}
