export type ActiveTool = 'merge' | 'image-to-pdf' | 'compress' | 'split';

export interface PdfMergeItem {
  id: string;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount: number;
  pageRange: string; // e.g. "all", "1-3", "2, 4-6"
  rotation: number; // 0, 90, 180, 270
}

export interface MergeOptions {
  outputFileName: string;
  addPageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'top-right';
  pageNumberFormat: 'strona-x-z-y' | 'x-of-y' | 'tylko-x';
  title?: string;
  author?: string;
}

export interface ImageToPdfItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  type: 'image/jpeg' | 'image/png' | string;
  width?: number;
  height?: number;
}

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'fit' | 'letter';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: 'none' | 'small' | 'normal';
  outputFileName: string;
}

export interface OptimizeOptions {
  removeMetadata: boolean;
  flattenAnnotations: boolean;
  useObjectStreams: boolean;
}
