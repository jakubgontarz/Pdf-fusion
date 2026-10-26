import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePageRanges, validatePageRange, formatBytes, mergeUnifiedQueue, generateTestPdf } from './pdfOperations';
import type { MergeQueueItem, MergeOptions } from '../types';

test('validatePageRange validates empty strings, valid ranges and catches errors', () => {
  // Empty or standard keyword -> valid, returns all pages
  assert.equal(validatePageRange('', 5).isValid, true);
  assert.deepEqual(validatePageRange('', 5).indices, [0, 1, 2, 3, 4]);
  assert.equal(validatePageRange('all', 3).isValid, true);
  assert.equal(validatePageRange('wszystkie', 3).isValid, true);

  // Valid specific ranges
  const v1 = validatePageRange('1-3, 5', 5);
  assert.equal(v1.isValid, true);
  assert.deepEqual(v1.indices, [0, 1, 2, 4]);

  // Out of range (exceeding document page count)
  const v2 = validatePageRange('1-10', 3);
  assert.equal(v2.isValid, false);
  assert.equal(v2.errorType, 'out_of_range');

  const v3 = validatePageRange('5', 3);
  assert.equal(v3.isValid, false);
  assert.equal(v3.errorType, 'out_of_range');

  // Reversed range e.g. 5-2
  const v4 = validatePageRange('5-2', 5);
  assert.equal(v4.isValid, false);
  assert.equal(v4.errorType, 'out_of_range');

  // Invalid format e.g. text or strange characters
  const v5 = validatePageRange('abc', 5);
  assert.equal(v5.isValid, false);
  assert.equal(v5.errorType, 'format');
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
