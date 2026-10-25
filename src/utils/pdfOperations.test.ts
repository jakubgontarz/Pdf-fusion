import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePageRanges, formatBytes, generateSamplePdf, mergePdfs, splitPdf } from './pdfOperations';
import type { PdfMergeItem } from '../types';

test('parsePageRanges parses standard ranges properly', () => {
  assert.deepEqual(parsePageRanges('1-3', 5), [0, 1, 2]);
  assert.deepEqual(parsePageRanges('1, 3, 5', 5), [0, 2, 4]);
  assert.deepEqual(parsePageRanges('2-4, 5', 5), [1, 2, 3, 4]);
});

test('parsePageRanges handles "all", empty strings, and out-of-bound inputs gracefully', () => {
  assert.deepEqual(parsePageRanges('', 3), [0, 1, 2]);
  assert.deepEqual(parsePageRanges('all', 3), [0, 1, 2]);
  assert.deepEqual(parsePageRanges('wszystkie', 4), [0, 1, 2, 3]);
  // Out of bound pages are clamped or omitted
  assert.deepEqual(parsePageRanges('1, 99', 3), [0]);
  assert.deepEqual(parsePageRanges('1-100', 3), [0, 1, 2]);
});

test('formatBytes formats bytes correctly into readable units', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(500), '500 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(1048576), '1 MB');
});

test('mergePdfs successfully merges two sample PDF documents into one', async () => {
  const sample1 = await generateSamplePdf('Raport Finansowy', 'Finanse', 2, 'slate');
  const sample2 = await generateSamplePdf('Specyfikacja Techniczna', 'Inzynieria', 3, 'indigo');

  assert.ok(sample1.byteLength > 0);
  assert.ok(sample2.byteLength > 0);

  const items: PdfMergeItem[] = [
    {
      id: 'doc-1',
      name: 'raport.pdf',
      size: sample1.byteLength,
      buffer: sample1.buffer as ArrayBuffer,
      pageCount: 2,
      pageRange: 'all',
      rotation: 0,
    },
    {
      id: 'doc-2',
      name: 'specyfikacja.pdf',
      size: sample2.byteLength,
      buffer: sample2.buffer as ArrayBuffer,
      pageCount: 3,
      pageRange: '1-2', // only first 2 pages
      rotation: 0,
    },
  ];

  const result = await mergePdfs(items, {
    outputFileName: 'polaczone.pdf',
    addPageNumbers: true,
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'strona-x-z-y',
    title: 'Wynikowy Test',
  });

  // 2 pages from doc-1 + 2 pages from doc-2 = 4 pages
  assert.equal(result.pageCount, 4);
  assert.ok(result.size > 0);
  assert.ok(result.pdfBytes.byteLength > 0);
});

test('splitPdf splits a sample document into single pages', async () => {
  const sample = await generateSamplePdf('Wielostronicowy Plik', 'Dokumentacja', 3, 'emerald');
  const pages = await splitPdf(sample.buffer as ArrayBuffer, 'dokument.pdf', 'single');

  assert.equal(pages.length, 3);
  assert.equal(pages[0].pageCount, 1);
  assert.equal(pages[0].filename, 'dokument_strona_1.pdf');
  assert.equal(pages[1].filename, 'dokument_strona_2.pdf');
  assert.equal(pages[2].filename, 'dokument_strona_3.pdf');
});
