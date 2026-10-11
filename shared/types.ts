export type ImageKind = 'img' | 'background' | 'svg' | 'canvas' | 'icon' | 'meta' | 'poster';

export interface ScannedImage {
  url: string;
  kind: ImageKind;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  estimated?: boolean;
}

export type OutputFormat = 'original' | 'png' | 'jpeg' | 'webp';

export type NamingMode = 'original' | 'sequence';

export interface OutputOptions {
  format: OutputFormat;
  quality: number;
  naming: NamingMode;
}

export interface PageInfo {
  tabId: number;
  title: string;
  url: string;
  favIconUrl: string;
}
