import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import type { PdfMergeItem, MergeOptions, ImageToPdfItem, ImageToPdfOptions, OptimizeOptions } from '../types';

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
    .replace(/[^\x00-\x7F]/g, ''); // strip any remaining non-ASCII
}

export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  if (totalPages <= 0) return [];
  const cleanStr = rangeStr.trim().toLowerCase();
  if (!cleanStr || cleanStr === 'all' || cleanStr === 'wszystkie') {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const resultIndices = new Set<number>();
  const parts = cleanStr.split(/[,;\s]+/).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let p = from; p <= to; p++) {
          resultIndices.add(p - 1);
        }
      }
    } else {
      const single = parseInt(part, 10);
      if (!isNaN(single) && single >= 1 && single <= totalPages) {
        resultIndices.add(single - 1);
      }
    }
  }

  const sorted = Array.from(resultIndices).sort((a, b) => a - b);
  // If parsing resulted in nothing valid, fallback to all pages
  return sorted.length > 0 ? sorted : Array.from({ length: totalPages }, (_, i) => i);
}

/**
 * Generates an in-memory sample PDF file with clean typography for testing without user uploads
 */
export async function generateSamplePdf(
  title: string,
  category: string,
  pageCount: number,
  colorScheme: 'slate' | 'indigo' | 'emerald' = 'slate'
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const colors = {
    slate: { primary: rgb(0.1, 0.15, 0.25), secondary: rgb(0.35, 0.4, 0.48) },
    indigo: { primary: rgb(0.18, 0.22, 0.55), secondary: rgb(0.4, 0.45, 0.65) },
    emerald: { primary: rgb(0.05, 0.35, 0.25), secondary: rgb(0.2, 0.5, 0.4) },
  }[colorScheme];

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]); // A4 in points
    const { width, height } = page.getSize();

    // Top Header band
    page.drawRectangle({
      x: 40,
      y: height - 80,
      width: width - 80,
      height: 2,
      color: colors.primary,
    });

    page.drawText(sanitizeForStandardFont(category.toUpperCase()), {
      x: 40,
      y: height - 65,
      size: 9,
      font: fontBold,
      color: colors.secondary,
    });

    page.drawText(sanitizeForStandardFont(`${title} - Czesc ${i}`), {
      x: 40,
      y: height - 120,
      size: 22,
      font: fontBold,
      color: colors.primary,
    });

    page.drawText(sanitizeForStandardFont('Dokument przykladowy wygenerowany lokalnie w przegladarce'), {
      x: 40,
      y: height - 145,
      size: 11,
      font: fontRegular,
      color: colors.secondary,
    });

    // Content box
    page.drawRectangle({
      x: 40,
      y: height - 400,
      width: width - 80,
      height: 220,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.88, 0.9, 0.93),
      borderWidth: 1,
    });

    page.drawText(sanitizeForStandardFont(`Sekcja dokumentu: Strona ${i} z ${pageCount}`), {
      x: 60,
      y: height - 220,
      size: 13,
      font: fontBold,
      color: colors.primary,
    });

    const lines = [
      'Ten dokument zostal utworzony automatycznie w celu przetestowania funkcji laczenia',
      'oraz manipulacji plikami PDF w Twojej lokalnej przegladarce bez przesylania danych.',
      'Mozesz dowolnie zmieniac kolejnosc tego pliku, obracac go lub laczyc z innymi PDF-ami.',
      `Sygnatura wygenerowania: PDF-FUSION-LOCAL-${Date.now().toString(36).toUpperCase()}`,
    ];

    lines.forEach((line, idx) => {
      page.drawText(sanitizeForStandardFont(line), {
        x: 60,
        y: height - 250 - idx * 24,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.3),
      });
    });

    // Footer
    page.drawText(sanitizeForStandardFont(`PDF Fusion - Lokalne Narzedzie PDF - Strona ${i} z ${pageCount}`), {
      x: 40,
      y: 40,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    });
  }

  doc.setTitle(sanitizeForStandardFont(title));
  doc.setAuthor('PDF Fusion Local');
  return await doc.save();
}

/**
 * Merge multiple PDF documents into a single document
 */
export async function mergePdfs(
  items: PdfMergeItem[],
  options: MergeOptions
): Promise<{ pdfBytes: Uint8Array; pageCount: number; size: number }> {
  if (items.length === 0) {
    throw new Error('Lista plików do połączenia jest pusta.');
  }

  const mergedDoc = await PDFDocument.create();

  if (options.title) {
    mergedDoc.setTitle(options.title);
  } else {
    mergedDoc.setTitle('Scalony Dokument PDF');
  }
  if (options.author) {
    mergedDoc.setAuthor(options.author);
  }
  mergedDoc.setCreator('PDF Fusion (Lokalne przetwarzanie)');

  let totalPagesCopied = 0;

  for (const item of items) {
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
      const { width } = page.getSize();

      let x = (width - textWidth) / 2;
      let y = 24;

      if (options.pageNumberPosition === 'bottom-right') {
        x = width - textWidth - 36;
        y = 24;
      } else if (options.pageNumberPosition === 'top-right') {
        x = width - textWidth - 36;
        y = page.getSize().height - 28;
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

  const pdfBytes = await mergedDoc.save({ useObjectStreams: true });
  return {
    pdfBytes,
    pageCount: mergedDoc.getPageCount(),
    size: pdfBytes.byteLength,
  };
}

/**
 * Convert a list of JPG/PNG images into a consolidated PDF
 */
export async function convertImagesToPdf(
  images: ImageToPdfItem[],
  options: ImageToPdfOptions
): Promise<{ pdfBytes: Uint8Array; pageCount: number; size: number }> {
  if (images.length === 0) {
    throw new Error('Nie dodano żadnych obrazów do konwersji.');
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(options.outputFileName.replace('.pdf', '') || 'Obrazy w PDF');
  pdfDoc.setCreator('PDF Fusion');

  // A4 dimensions in points (72 points per inch)
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  for (const imgItem of images) {
    // Fetch image data array buffer from dataUrl
    const res = await fetch(imgItem.dataUrl);
    const imgBytes = await res.arrayBuffer();

    let embeddedImg;
    const isPng = imgItem.type === 'image/png' || imgItem.name.toLowerCase().endsWith('.png');

    try {
      if (isPng) {
        embeddedImg = await pdfDoc.embedPng(imgBytes);
      } else {
        embeddedImg = await pdfDoc.embedJpg(imgBytes);
      }
    } catch {
      // If extension was mismatched, fallback attempt
      try {
        embeddedImg = await pdfDoc.embedJpg(imgBytes);
      } catch {
        embeddedImg = await pdfDoc.embedPng(imgBytes);
      }
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = A4_WIDTH;
    let pageHeight = A4_HEIGHT;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth;
      pageHeight = imgHeight;
    } else {
      const isLandscape =
        options.orientation === 'landscape' ||
        (options.orientation === 'auto' && imgWidth > imgHeight);

      if (isLandscape) {
        pageWidth = A4_HEIGHT;
        pageHeight = A4_WIDTH;
      } else {
        pageWidth = A4_WIDTH;
        pageHeight = A4_HEIGHT;
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Margins
    let margin = 0;
    if (options.pageSize !== 'fit') {
      if (options.margin === 'small') margin = 20;
      if (options.margin === 'normal') margin = 40;
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
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return {
    pdfBytes,
    pageCount: pdfDoc.getPageCount(),
    size: pdfBytes.byteLength,
  };
}

/**
 * Optimize & compress PDF by rebuilding document streams, stripping metadata or annotations
 */
export async function optimizePdf(
  buffer: ArrayBuffer,
  options: OptimizeOptions
): Promise<{ pdfBytes: Uint8Array; originalSize: number; newSize: number; pageCount: number }> {
  const originalSize = buffer.byteLength;
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = srcDoc.getPageCount();

  const newDoc = await PDFDocument.create();

  if (!options.removeMetadata) {
    if (srcDoc.getTitle()) newDoc.setTitle(srcDoc.getTitle()!);
    if (srcDoc.getAuthor()) newDoc.setAuthor(srcDoc.getAuthor()!);
  }

  const indices = Array.from({ length: pageCount }, (_, i) => i);
  const copiedPages = await newDoc.copyPages(srcDoc, indices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  const pdfBytes = await newDoc.save({
    useObjectStreams: options.useObjectStreams,
    addDefaultPage: false,
  });

  return {
    pdfBytes,
    originalSize,
    newSize: pdfBytes.byteLength,
    pageCount,
  };
}

/**
 * Split PDF document into individual pages or page groups
 */
export async function splitPdf(
  buffer: ArrayBuffer,
  baseName: string,
  splitMode: 'single' | 'range',
  rangesStr?: string
): Promise<Array<{ filename: string; pdfBytes: Uint8Array; pageCount: number }>> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const results: Array<{ filename: string; pdfBytes: Uint8Array; pageCount: number }> = [];

  const cleanBase = baseName.replace(/\.pdf$/i, '');

  if (splitMode === 'single') {
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const pdfBytes = await newDoc.save({ useObjectStreams: true });
      results.push({
        filename: `${cleanBase}_strona_${i + 1}.pdf`,
        pdfBytes,
        pageCount: 1,
      });
    }
  } else {
    // Custom range
    const targetIndices = parsePageRanges(rangesStr || '1', totalPages);
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, targetIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));
    const pdfBytes = await newDoc.save({ useObjectStreams: true });
    results.push({
      filename: `${cleanBase}_wybrane_strony.pdf`,
      pdfBytes,
      pageCount: copiedPages.length,
    });
  }

  return results;
}
