import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import type { MergeQueueItem, MergeOptions } from '../types';

/**
 * Format bytes into human-readable strings (e.g. 1.4 MB, 520 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

/**
 * Converts unicode characters (e.g. Polish diacritics) into WinAnsi compatible characters
 * for PDF StandardFonts (Helvetica, Times, etc.)
 */
export function sanitizeForStandardFont(text: string): string {
  const diacriticsMap: Record<string, string> = {
    'ą': 'a', 'Ą': 'A',
    'ć': 'c', 'Ć': 'C',
    'ę': 'e', 'Ę': 'E',
    'ł': 'l', 'Ł': 'L',
    'ń': 'n', 'Ń': 'N',
    'ó': 'o', 'Ó': 'O',
    'ś': 's', 'Ś': 'S',
    'ź': 'z', 'Ź': 'Z',
    'ż': 'z', 'Ż': 'Z',
  };
  return text
    .split('')
    .map(char => diacriticsMap[char] || char)
    .join('')
    .replace(/[^\x00-\x7F]/g, '');
}

export interface PageRangeValidationResult {
  isValid: boolean;
  errorType?: 'out_of_range' | 'format';
  indices: number[];
}

/**
 * Validates user-provided page range string (e.g. "1-3, 5") against document total pages.
 * Empty string or standard keywords mean all pages and are valid.
 */
export function validatePageRange(rangeStr: string, totalPages: number): PageRangeValidationResult {
  if (totalPages <= 0) {
    return { isValid: true, indices: [] };
  }
  const cleanStr = rangeStr.trim().toLowerCase();
  if (!cleanStr || ['all', 'wszystkie', 'alle', 'todas', 'toutes'].includes(cleanStr)) {
    return { isValid: true, indices: Array.from({ length: totalPages }, (_, i) => i) };
  }

  const parts = cleanStr.split(/[,;\s]+/).filter(Boolean);
  if (parts.length === 0) {
    return { isValid: true, indices: Array.from({ length: totalPages }, (_, i) => i) };
  }

  const resultIndices: number[] = [];

  for (const part of parts) {
    if (part.includes('-')) {
      const sides = part.split('-');
      if (sides.length !== 2) {
        return { isValid: false, errorType: 'format', indices: [] };
      }
      const s0 = sides[0].trim();
      const s1 = sides[1].trim();
      if (!/^\d+$/.test(s0) || !/^\d+$/.test(s1)) {
        return { isValid: false, errorType: 'format', indices: [] };
      }
      const start = parseInt(s0, 10);
      const end = parseInt(s1, 10);
      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || start > totalPages || end > totalPages) {
        return { isValid: false, errorType: 'out_of_range', indices: [] };
      }
      for (let p = start; p <= end; p++) {
        resultIndices.push(p - 1);
      }
    } else {
      const trimmed = part.trim();
      if (!/^\d+$/.test(trimmed)) {
        return { isValid: false, errorType: 'format', indices: [] };
      }
      const single = parseInt(trimmed, 10);
      if (isNaN(single) || single < 1 || single > totalPages) {
        return { isValid: false, errorType: 'out_of_range', indices: [] };
      }
      resultIndices.push(single - 1);
    }
  }

  return { isValid: true, indices: resultIndices };
}

/**
 * Parses user input for page ranges like "1-3, 5, 7-9" into an array of 0-based page indices.
 * If rangeStr is empty, invalid, or "all", all pages (0 to totalPages - 1) are returned.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const res = validatePageRange(rangeStr, totalPages);
  if (res.isValid && res.indices.length > 0) {
    return res.indices;
  }
  return Array.from({ length: totalPages }, (_, i) => i);
}


/**
 * In-browser canvas image compressor / resizer
 */
export async function compressImageDataUrl(
  dataUrl: string,
  quality: number,
  maxDimension = 1600
): Promise<{ bytes: Uint8Array; isJpeg: boolean }> {
  // If running in Node environment (e.g. unit tests), fallback to fetch buffer
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    const res = await fetch(dataUrl);
    const buf = await res.arrayBuffer();
    return { bytes: new Uint8Array(buf), isJpeg: true };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        fetch(dataUrl)
          .then((r) => r.arrayBuffer())
          .then((buf) => resolve({ bytes: new Uint8Array(buf), isJpeg: true }))
          .catch(() => resolve({ bytes: new Uint8Array(), isJpeg: true }));
        return;
      }

      // Draw with white background for transparency fallback
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            const buf = await (await fetch(dataUrl)).arrayBuffer();
            resolve({ bytes: new Uint8Array(buf), isJpeg: true });
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve({ bytes: new Uint8Array(buf), isJpeg: true });
        },
        'image/jpeg',
        Math.max(0.1, Math.min(1.0, quality))
      );
    };

    img.onerror = async () => {
      try {
        const buf = await (await fetch(dataUrl)).arrayBuffer();
        resolve({ bytes: new Uint8Array(buf), isJpeg: true });
      } catch {
        resolve({ bytes: new Uint8Array(), isJpeg: true });
      }
    };

    img.src = dataUrl;
  });
}

/**
 * Unified Merge: Combines PDFs and Images in a single ordered document
 */
export async function mergeUnifiedQueue(
  items: MergeQueueItem[],
  options: MergeOptions
): Promise<{ pdfBytes: Uint8Array; pageCount: number; size: number }> {
  if (items.length === 0) {
    throw new Error('Lista plików do połączenia jest pusta.');
  }

  const mergedDoc = await PDFDocument.create();

  if (!options.compress || !options.removeMetadata) {
    if (options.title) mergedDoc.setTitle(sanitizeForStandardFont(options.title));
    mergedDoc.setCreator('PDF Fusion');
  }

  // A4 standard points
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  let totalPagesCopied = 0;

  for (const item of items) {
    if (item.type === 'pdf') {
      if (!item.buffer) continue;
      const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
      const srcPageCount = srcDoc.getPageCount();
      const targetIndices = parsePageRanges(item.pageRange, srcPageCount);

      const copiedPages = await mergedDoc.copyPages(srcDoc, targetIndices);

      for (const page of copiedPages) {
        if (item.rotation && item.rotation !== 0) {
          const currentRot = page.getRotation().angle;
          page.setRotation(degrees((currentRot + item.rotation) % 360));
        }
        mergedDoc.addPage(page);
        totalPagesCopied++;
      }
    } else if (item.type === 'image') {
      if (!item.dataUrl) continue;

      let imgBytes: Uint8Array;
      let isJpeg = true;

      if (options.compress) {
        const compressed = await compressImageDataUrl(
          item.dataUrl,
          options.compressionQuality / 100,
          options.maxImageDimension
        );
        imgBytes = compressed.bytes;
        isJpeg = compressed.isJpeg;
      } else {
        const res = await fetch(item.dataUrl);
        imgBytes = new Uint8Array(await res.arrayBuffer());
        isJpeg =
          item.imageMime === 'image/jpeg' ||
          item.name.toLowerCase().endsWith('.jpg') ||
          item.name.toLowerCase().endsWith('.jpeg');
      }

      let embeddedImg;
      try {
        if (isJpeg) {
          embeddedImg = await mergedDoc.embedJpg(imgBytes);
        } else {
          embeddedImg = await mergedDoc.embedPng(imgBytes);
        }
      } catch {
        try {
          embeddedImg = await mergedDoc.embedJpg(imgBytes);
        } catch {
          embeddedImg = await mergedDoc.embedPng(imgBytes);
        }
      }

      const imgWidth = embeddedImg.width;
      const imgHeight = embeddedImg.height;

      let pageWidth = A4_WIDTH;
      let pageHeight = A4_HEIGHT;

      if (item.imagePageSize === 'fit') {
        pageWidth = imgWidth;
        pageHeight = imgHeight;
      } else {
        let baseW = A4_WIDTH;
        let baseH = A4_HEIGHT;

        if (item.imagePageSize === 'a3') {
          baseW = 841.89;
          baseH = 1190.55;
        } else if (item.imagePageSize === 'a5') {
          baseW = 419.53;
          baseH = 595.28;
        } else if (item.imagePageSize === 'letter') {
          baseW = 612.00;
          baseH = 792.00;
        } else if (item.imagePageSize === 'legal') {
          baseW = 612.00;
          baseH = 1008.00;
        } else if (item.imagePageSize === 'custom') {
          // Convert mm to points (1 mm = 72 / 25.4 pt = 2.834645669 pt)
          const mmW = Math.max(10, Math.min(2500, Number(item.customWidthMm) || 210));
          const mmH = Math.max(10, Math.min(2500, Number(item.customHeightMm) || 297));
          baseW = mmW * (72 / 25.4);
          baseH = mmH * (72 / 25.4);
        }

        const isLandscape =
          item.imageOrientation === 'landscape' ||
          (item.imageOrientation === 'auto' && imgWidth > imgHeight);

        const minDim = Math.min(baseW, baseH);
        const maxDim = Math.max(baseW, baseH);

        if (isLandscape) {
          pageWidth = maxDim;
          pageHeight = minDim;
        } else {
          pageWidth = minDim;
          pageHeight = maxDim;
        }
      }

      const page = mergedDoc.addPage([pageWidth, pageHeight]);

      let margin = 0;
      if (item.imagePageSize !== 'fit') {
        if (item.imageMargin === 'small') margin = 20;
        if (item.imageMargin === 'normal') margin = 40;
      }

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight, 1);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      if (item.rotation && item.rotation !== 0) {
        page.setRotation(degrees(item.rotation % 360));
      }

      totalPagesCopied++;
    }
  }

  // Stamp page numbers if requested
  if (options.addPageNumbers && totalPagesCopied > 0) {
    const font = await mergedDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 9;
    const fontColor = rgb(0.4, 0.45, 0.5);

    const totalCount = mergedDoc.getPageCount();
    const pages = mergedDoc.getPages();

    pages.forEach((page, index) => {
      const pageNum = index + 1;
      let text = `${pageNum} / ${totalCount}`;
      if (options.pageNumberFormat === 'strona-x-z-y') {
        text = `Strona ${pageNum} z ${totalCount}`;
      } else if (options.pageNumberFormat === 'tylko-x') {
        text = `${pageNum}`;
      }

      const safeText = sanitizeForStandardFont(text);
      const textWidth = font.widthOfTextAtSize(safeText, fontSize);
      const { width, height } = page.getSize();

      let x = (width - textWidth) / 2;
      let y = 24;

      if (options.pageNumberPosition === 'bottom-right') {
        x = width - textWidth - 36;
        y = 24;
      } else if (options.pageNumberPosition === 'top-right') {
        x = width - textWidth - 36;
        y = height - 28;
      }

      page.drawText(safeText, {
        x,
        y,
        size: fontSize,
        font,
        color: fontColor,
      });
    });
  }

  const pdfBytes = await mergedDoc.save({
    useObjectStreams: options.compress ? true : true,
  });

  return {
    pdfBytes,
    pageCount: mergedDoc.getPageCount(),
    size: pdfBytes.byteLength,
  };
}

/**
 * Creates a minimal valid sample PDF for automated testing
 */
export async function generateTestPdf(title: string, pages = 2): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(sanitizeForStandardFont(`${title} - Strona ${i}`), {
      x: 50,
      y: 750,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }
  return await doc.save();
}
