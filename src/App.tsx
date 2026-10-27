/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import type { MergeQueueItem, MergeOptions } from './types';
import { mergeUnifiedQueue, validatePageRange } from './utils/pdfOperations';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { PdfMergeList } from './components/PdfMergeList';
import { MergeSettings } from './components/MergeSettings';
import { PdfResultModal } from './components/PdfResultModal';
import { ArrowRight, Layers, AlertCircle, Check, X } from 'lucide-react';
import {
  type Language,
  translations,
  detectDefaultLanguage,
} from './i18n/translations';

export default function App() {
  // Theme state with localStorage & system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('pdf_fusion_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Language state with localStorage & navigator language detection
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('pdf_fusion_lang');
      if (savedLang && ['pl', 'en', 'de', 'es', 'fr'].includes(savedLang)) {
        return savedLang as Language;
      }
      return detectDefaultLanguage();
    }
    return 'pl';
  });

  const t = translations[language];

  // Apply theme class to documentElement and persist
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#fafafa';
      document.documentElement.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('pdf_fusion_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem('pdf_fusion_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [items, setItems] = useState<MergeQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergeOptions, setMergeOptions] = useState<MergeOptions>({
    outputFileName: 'scalony_dokument.pdf',
    addPageNumbers: false,
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'strona-x-z-y',
    compress: false,
    compressionPreset: 'balanced',
    compressionQuality: 65,
    removeMetadata: true,
    maxImageDimension: 1600,
  });

  const [mergeResult, setMergeResult] = useState<{
    pdfBytes: Uint8Array;
    fileName: string;
    pageCount: number;
    originalBytes: number;
    durationMs: number;
  } | null>(null);

  // Top notification banner for actions (e.g. applying settings to all images)
  const [topNotification, setTopNotification] = useState<{
    id: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!topNotification) return;
    const timer = setTimeout(() => {
      setTopNotification((curr) => (curr?.id === topNotification.id ? null : curr));
    }, 3500);
    return () => clearTimeout(timer);
  }, [topNotification]);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const newItems: MergeQueueItem[] = [];

      for (const file of files) {
        const isPdf =
          file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const isImage =
          file.type.startsWith('image/') ||
          /\.(jpg|jpeg|png|webp)$/i.test(file.name);

        if (isPdf) {
          const buffer = await file.arrayBuffer();
          try {
            const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
            newItems.push({
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              type: 'pdf',
              name: file.name,
              size: file.size,
              buffer,
              pageCount: doc.getPageCount(),
              pageRange: '', // Default to empty string so gray placeholder appears!
              rotation: 0,
              imagePageSize: 'a4',
              imageOrientation: 'portrait',
              imageMargin: 'small',
            });
          } catch (e) {
            console.error(`Nie udało się wczytać PDF: ${file.name}`, e);
          }
        } else if (isImage) {
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });

          newItems.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type: 'image',
            name: file.name,
            size: file.size,
            dataUrl,
            imageMime: file.type || 'image/jpeg',
            pageCount: 1,
            pageRange: '1',
            rotation: 0,
            imagePageSize: 'a4',
            customWidthMm: 210,
            customHeightMm: 297,
            imageOrientation: 'portrait',
            imageMargin: 'small',
          });
        }
      }

      setItems((prev) => [...prev, ...newItems]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // Reorder items via Drag & Drop
  const handleReorder = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleRotate = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateRange = (id: string, range: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pageRange: range } : item))
    );
  };

  const handleUpdateImageOption = (id: string, partial: Partial<MergeQueueItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const handleApplyImageSettingsToAll = (sourceId: string) => {
    const sourceItem = items.find((i) => i.id === sourceId);
    if (!sourceItem || sourceItem.type !== 'image') return;

    const otherImages = items.filter((i) => i.type === 'image' && i.id !== sourceId);
    if (otherImages.length === 0) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.type !== 'image' || item.id === sourceId) return item;
        return {
          ...item,
          imagePageSize: sourceItem.imagePageSize,
          customWidthMm: sourceItem.customWidthMm ?? 210,
          customHeightMm: sourceItem.customHeightMm ?? 297,
          imageOrientation: sourceItem.imageOrientation,
          imageMargin: sourceItem.imageMargin,
        };
      })
    );

    const message =
      language === 'pl' && otherImages.length === 1
        ? 'Zastosowano do 1 pozostałego obrazu'
        : t.appliedToRemainingImages.replace('{count}', String(otherImages.length));

    setTopNotification({
      id: Date.now(),
      message,
    });
  };

  const handleClearAll = () => {
    setItems([]);
  };

  // Validate if any item has an invalid page range
  const hasRangeErrors = items.some(
    (item) => item.type === 'pdf' && !validatePageRange(item.pageRange, item.pageCount).isValid
  );

  const handleExecuteMerge = async () => {
    if (items.length === 0 || hasRangeErrors) return;

    setIsProcessing(true);
    const startTime = performance.now();

    try {
      const result = await mergeUnifiedQueue(items, mergeOptions);
      const durationMs = Math.round(performance.now() - startTime);

      setMergeResult({
        pdfBytes: result.pdfBytes,
        fileName: mergeOptions.outputFileName || 'scalony_dokument.pdf',
        pageCount: result.pageCount,
        originalBytes: items.reduce((acc, curr) => acc + curr.size, 0),
        durationMs,
      });
    } catch (error: any) {
      alert(`Wystąpił błąd podczas łączenia: ${error?.message || 'Nieznany błąd'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors relative">
      {/* Top Notification Toast */}
      {topNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-900/95 dark:bg-neutral-800/95 text-white border border-neutral-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </span>
              <p className="text-xs sm:text-sm font-medium text-neutral-100 truncate">
                {topNotification.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTopNotification(null)}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label={t.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Header
        t={t}
        currentLang={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {items.length === 0 ? (
          /* Empty state: Clean dropzone without fluff */
          <div className="max-w-xl mx-auto py-6 sm:py-8">
            <DropZone t={t} onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
          </div>
        ) : (
          /* Workspace with balanced columns (7/5 on lg, 8/4 on xl) */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Files queue (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <PdfMergeList
                  t={t}
                  currentLang={language}
                  items={items}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onReorder={handleReorder}
                  onRotate={handleRotate}
                  onRemove={handleRemove}
                  onUpdateRange={handleUpdateRange}
                  onUpdateImageOption={handleUpdateImageOption}
                  onApplyImageSettingsToAll={handleApplyImageSettingsToAll}
                  onClearAll={handleClearAll}
                />

                <DropZone t={t} onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
              </div>

              {/* Settings column (5 cols on desktop - wider) */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                <MergeSettings t={t} options={mergeOptions} onChange={setMergeOptions} />

                {/* Validation warning if ranges are invalid */}
                {hasRangeErrors && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                    <span>{t.fixRangeErrors}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExecuteMerge}
                  disabled={isProcessing || hasRangeErrors}
                  className={`w-full py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    hasRangeErrors
                      ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed opacity-60'
                      : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isProcessing ? t.processing : t.mergeButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Result Modal */}
      {mergeResult && (
        <PdfResultModal
          t={t}
          currentLang={language}
          pdfBytes={mergeResult.pdfBytes}
          fileName={mergeResult.fileName}
          pageCount={mergeResult.pageCount}
          originalBytes={mergeResult.originalBytes}
          durationMs={mergeResult.durationMs}
          onClose={() => setMergeResult(null)}
          onReset={() => {
            setMergeResult(null);
            setItems([]);
          }}
        />
      )}
    </div>
  );
}
