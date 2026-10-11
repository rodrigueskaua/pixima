import { onMounted, onUnmounted, ref } from 'vue';
import { browser } from 'wxt/browser';
import type { PageInfo, ScannedImage } from '@/shared/types';
import { runPool } from '@/utils/images';
import { scanPage } from '@/utils/scanPage';

export type ScanStatus = 'loading' | 'ready' | 'blocked';

const FRAME_SCAN_TIMEOUT = 8000;
const SETTLE_CAP = 4500;
const PAGE_LOAD_CAP = 3500;
const PAGE_POLL_INTERVAL = 250;
const MIN_SKELETON = 400;
const SETTLE_AFTER_LOAD = 700;
const SETTLE_AFTER_NAVIGATION = 900;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const MEASURE_TIMEOUT = 6000;
const MEASURE_PARALLEL = 8;
const SVG_FALLBACK_SIZE = 300;

function loadSize(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.referrerPolicy = 'no-referrer';
    const timer = setTimeout(() => {
      image.src = '';
      resolve(null);
    }, MEASURE_TIMEOUT);
    image.onload = () => {
      clearTimeout(timer);
      resolve({
        width: image.naturalWidth || SVG_FALLBACK_SIZE,
        height: image.naturalHeight || SVG_FALLBACK_SIZE,
      });
    };
    image.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    image.src = url;
  });
}

export function usePageImages() {
  const page = ref<PageInfo | null>(null);
  const images = ref<ScannedImage[]>([]);
  const status = ref<ScanStatus>('loading');
  const scanningFrames = ref(false);
  const generation = ref(0);
  const measuring = ref(0);
  const waitingPage = ref(false);
  let scheduled: ReturnType<typeof setTimeout> | undefined;
  let skipWaiting = false;
  let windowId: number | undefined;
  let run = 0;
  let attempted = new Set<string>();

  async function measureUnknown(current: number) {
    const pending = images.value.filter(
      (image) => (!image.width || !image.height) && !attempted.has(image.url),
    );
    for (const image of pending) attempted.add(image.url);
    if (!pending.length) return;
    measuring.value += pending.length;
    await runPool(pending, MEASURE_PARALLEL, async (image) => {
      const size = await loadSize(image.url);
      measuring.value--;
      if (current !== run || !size) return;
      const target = images.value.find((item) => item.url === image.url);
      if (!target) return;
      target.width = size.width;
      target.height = size.height;
      target.estimated = false;
    });
  }

  async function waitForPageLoad(tabId: number, current: number) {
    const deadline = Date.now() + PAGE_LOAD_CAP;
    while (Date.now() < deadline && current === run && !skipWaiting) {
      const tab = await browser.tabs.get(tabId).catch(() => null);
      if (!tab || tab.status !== 'loading') return;
      await sleep(PAGE_POLL_INTERVAL);
    }
  }

  async function scan() {
    const current = ++run;
    generation.value++;
    clearTimeout(scheduled);
    skipWaiting = false;
    measuring.value = 0;
    attempted = new Set();
    status.value = 'loading';
    scanningFrames.value = false;
    waitingPage.value = false;

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (current !== run) return;
    if (!tab?.id) {
      page.value = null;
      images.value = [];
      status.value = 'blocked';
      return;
    }

    windowId = tab.windowId;
    const startedAt = Date.now();
    const describe = (info: { id?: number; title?: string; url?: string; favIconUrl?: string }) => ({
      tabId: tab.id as number,
      title: info.title ?? '',
      url: info.url ?? '',
      favIconUrl: info.favIconUrl ?? '',
    });
    page.value = describe(tab);

    if (tab.status === 'loading') {
      waitingPage.value = true;
      await waitForPageLoad(tab.id, current);
      if (current !== run) return;
      waitingPage.value = false;
      if (!skipWaiting) await sleep(SETTLE_AFTER_LOAD);
      if (current !== run) return;
      const fresh = await browser.tabs.get(tab.id).catch(() => null);
      if (fresh) page.value = describe(fresh);
    }

    try {
      const [main] = await browser.scripting.executeScript({
        target: { tabId: tab.id, frameIds: [0] },
        func: scanPage,
      });
      if (current !== run) return;
      images.value = main?.result ?? [];
    } catch {
      if (current !== run) return;
      images.value = [];
      status.value = 'blocked';
      return;
    }

    const mainMeasured = measureUnknown(current);
    const framesDone = scanFrames(current, tab.id);

    await Promise.race([Promise.all([mainMeasured, framesDone]), sleep(SETTLE_CAP)]);
    const remaining = MIN_SKELETON - (Date.now() - startedAt);
    if (remaining > 0) await sleep(remaining);
    if (current !== run) return;
    status.value = 'ready';
  }

  async function scanFrames(current: number, tabId: number) {
    scanningFrames.value = true;
    const frames = await Promise.race([
      browser.scripting
        .executeScript({ target: { tabId, allFrames: true }, func: scanPage })
        .catch(() => null),
      sleep(FRAME_SCAN_TIMEOUT).then(() => null),
    ]);
    if (current !== run) return;
    scanningFrames.value = false;
    if (!frames) return;

    const known = new Set(images.value.map((image) => image.url));
    const extra: ScannedImage[] = [];
    for (const frame of frames) {
      if (frame.frameId === 0) continue;
      for (const image of frame.result ?? []) {
        if (known.has(image.url)) continue;
        known.add(image.url);
        extra.push(image);
      }
    }
    if (!extra.length) return;
    images.value = [...images.value, ...extra];
    await measureUnknown(current);
  }

  function scheduleScan(delay: number, task: () => void = scan) {
    clearTimeout(scheduled);
    scheduled = setTimeout(task, delay);
  }

  async function refreshQuietly() {
    if (status.value !== 'ready' || !page.value) {
      scan();
      return;
    }
    const current = run;
    const tabId = page.value.tabId;
    try {
      const [main] = await browser.scripting.executeScript({
        target: { tabId, frameIds: [0] },
        func: scanPage,
      });
      if (current !== run) return;
      const known = new Set(images.value.map((image) => image.url));
      const extra = (main?.result ?? []).filter((image) => !known.has(image.url));
      if (extra.length) images.value = [...images.value, ...extra];
    } catch {
      return;
    }
    await Promise.all([measureUnknown(current), scanFrames(current, tabId)]);
  }

  function showNow() {
    skipWaiting = true;
  }

  function setDimensions(url: string, width: number, height: number) {
    const image = images.value.find((item) => item.url === url);
    if (!image) return;
    if (!image.estimated && image.width && image.height) return;
    image.width = width;
    image.height = height;
    image.estimated = false;
  }

  function onActivated(info: { windowId: number }) {
    if (windowId === undefined || info.windowId === windowId) {
      clearTimeout(scheduled);
      waitingPage.value = false;
      scan();
    }
  }

  function onUpdated(tabId: number, change: { status?: string; url?: string }) {
    if (tabId !== page.value?.tabId) return;
    if (change.status === 'loading') {
      run++;
      status.value = 'loading';
      waitingPage.value = true;
      clearTimeout(scheduled);
      return;
    }
    if (change.status === 'complete') {
      waitingPage.value = false;
      scheduleScan(SETTLE_AFTER_LOAD, refreshQuietly);
      return;
    }
    if (change.url) {
      run++;
      status.value = 'loading';
      scheduleScan(SETTLE_AFTER_NAVIGATION);
    }
  }

  onMounted(() => {
    scan();
    browser.tabs.onActivated.addListener(onActivated);
    browser.tabs.onUpdated.addListener(onUpdated);
  });

  onUnmounted(() => {
    clearTimeout(scheduled);
    browser.tabs.onActivated.removeListener(onActivated);
    browser.tabs.onUpdated.removeListener(onUpdated);
  });

  return {
    page,
    images,
    status,
    scanningFrames,
    measuring,
    waitingPage,
    generation,
    scan,
    showNow,
    setDimensions,
  };
}
