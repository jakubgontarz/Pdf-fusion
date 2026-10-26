import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePageRanges, formatBytes, mergeUnifiedQueue, generateTestPdf } from './pdfOperations';
import type { MergeQueueItem, MergeOptions } from '../types';

test('parsePageRanges parses page ranges properly', () => {
  assert.deepEqual(parsePageRanges('1-3', 5), [0, 1, 2]);
  assert.deepEqual(parsePageRanges('1, 3, 5', 5), [0, 2, 4]);
  assert.deepEqual(parsePageRanges('all', 3), [0, 1, 2]);
  assert.deepEqual(parsePageRanges('', 3), [0, 1, 2]);
});

test('formatBytes formats bytes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
});

test('mergeUnifiedQueue merges PDF items seamlessly', async () => {
  const pdfBytes1 = await generateTestPdf('Dokument A', 2);
  const pdfBytes2 = await generateTestPdf('Dokument B', 1);

  const items: MergeQueueItem[] = [
    {
      id: 'item-1',
      type: 'pdf',
      name: 'dok1.pdf',
      size: pdfBytes1.byteLength,
      buffer: pdfBytes1.buffer as ArrayBuffer,
      pageCount: 2,
      pageRange: 'all',
      rotation: 0,
      imagePageSize: 'a4',
      imageOrientation: 'portrait',
      imageMargin: 'small',
    },
    {
      id: 'item-2',
      type: 'pdf',
      name: 'dok2.pdf',
      size: pdfBytes2.byteLength,
      buffer: pdfBytes2.buffer as ArrayBuffer,
      pageCount: 1,
      pageRange: '1',
      rotation: 0,
      imagePageSize: 'a4',
      imageOrientation: 'portrait',
      imageMargin: 'small',
    },
  ];

  const defaultOptions: MergeOptions = {
    outputFileName: 'scalony.pdf',
    addPageNumbers: true,
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'strona-x-z-y',
    compress: false,
    compressionPreset: 'balanced',
    compressionQuality: 65,
    removeMetadata: true,
    maxImageDimension: 1600,
  };

  const res = await mergeUnifiedQueue(items, defaultOptions);
  assert.equal(res.pageCount, 3);
  assert.ok(res.pdfBytes.byteLength > 0);
});

test('mergeUnifiedQueue applies compression options when enabled', async () => {
  const pdfBytes = await generateTestPdf('Dokument Test', 2);

  const items: MergeQueueItem[] = [
    {
      id: 'item-1',
      type: 'pdf',
      name: 'dok1.pdf',
      size: pdfBytes.byteLength,
      buffer: pdfBytes.buffer as ArrayBuffer,
      pageCount: 2,
      pageRange: 'all',
      rotation: 0,
      imagePageSize: 'a4',
      imageOrientation: 'portrait',
      imageMargin: 'small',
    },
  ];

  const compressedOptions: MergeOptions = {
    outputFileName: 'skompresowany.pdf',
    addPageNumbers: false,
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'strona-x-z-y',
    compress: true,
    compressionPreset: 'strong',
    compressionQuality: 40,
    removeMetadata: true,
    maxImageDimension: 1200,
  };

  const res = await mergeUnifiedQueue(items, compressedOptions);
  assert.equal(res.pageCount, 2);
  assert.ok(res.pdfBytes.byteLength > 0);
});
