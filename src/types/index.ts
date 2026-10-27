export type MergeItemType = 'pdf' | 'image';

export interface MergeQueueItem {
  id: string;
  type: MergeItemType;
  name: string;
  size: number;
  buffer?: ArrayBuffer; // For PDF
  dataUrl?: string; // For images
  imageMime?: string; // e.g. 'image/jpeg', 'image/png'
  pageCount: number; // 1 for image, N for PDF
  pageRange: string; // for PDF, e.g. 'all', '1-3'
  rotation: number; // 0, 90, 180, 270
  // Image-specific layout options
  imagePageSize: 'a4' | 'a3' | 'a5' | 'letter' | 'legal' | 'fit' | 'custom';
  customWidthMm?: number;
  customHeightMm?: number;
  imageOrientation: 'portrait' | 'landscape' | 'auto';
  imageMargin: 'none' | 'small' | 'normal';
}

export type CompressionPreset = 'light' | 'balanced' | 'strong';

export interface MergeOptions {
  outputFileName: string;
  addPageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'top-right';
  pageNumberFormat: 'strona-x-z-y' | 'x-of-y' | 'tylko-x';
  title?: string;
  // Compression options
  compress: boolean;
  compressionPreset: CompressionPreset;
  compressionQuality: number; // e.g. 40, 65, 85
  removeMetadata: boolean;
  maxImageDimension: number; // e.g. 1200, 1600, 2000
}
